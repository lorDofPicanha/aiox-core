#!/usr/bin/env python
"""Sync AIOS memory episodes into Graphiti.

This script is optional. The AIOS memory layer works without Graphiti; Graphiti
adds a temporal knowledge graph when `graphiti-core` and a graph backend are
installed.

Backends:
  AIOS_GRAPHITI_BACKEND=kuzu     (default, embedded/local)
  AIOS_GRAPHITI_BACKEND=neo4j
  AIOS_GRAPHITI_BACKEND=falkordb

Required for Graphiti itself:
  OPENAI_API_KEY or another Graphiti-supported LLM provider configuration.
"""

from __future__ import annotations

import argparse
import asyncio
import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


AIOS_ROOT = Path(__file__).resolve().parents[3]
MEMORY_DIR = AIOS_ROOT / ".aios-core" / "data" / "memory"
OUTBOX = MEMORY_DIR / "graphiti-outbox.jsonl"
STATE = MEMORY_DIR / "graphiti-state.json"
GRAPHITI_ENV = AIOS_ROOT / ".aios-core" / "infrastructure" / "graphiti" / ".env"


def read_json(path: Path, fallback: Any) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return fallback


def write_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


def read_jsonl(path: Path) -> list[dict[str, Any]]:
    if not path.exists():
        return []
    rows: list[dict[str, Any]] = []
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line:
            continue
        rows.append(json.loads(line))
    return rows


def parse_reference_time(value: str | None) -> datetime:
    if not value:
        return datetime.now(timezone.utc)
    normalized = value.replace("Z", "+00:00")
    try:
        dt = datetime.fromisoformat(normalized)
    except ValueError:
        return datetime.now(timezone.utc)
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt


async def build_graphiti():
    try:
        from dotenv import load_dotenv

        load_dotenv(AIOS_ROOT / ".env")
        load_dotenv(GRAPHITI_ENV)
    except Exception:
        pass

    try:
        from graphiti_core import Graphiti
        from graphiti_core.nodes import EpisodeType
    except ImportError as exc:
        raise SystemExit(
            "graphiti-core is not installed. Install with:\n"
            "  pip install graphiti-core\n"
            "or for FalkorDB:\n"
            "  pip install 'graphiti-core[falkordb]'"
        ) from exc

    backend = os.getenv("AIOS_GRAPHITI_BACKEND", "kuzu").lower()

    if backend == "kuzu":
        try:
            from graphiti_core.driver.kuzu_driver import KuzuDriver
        except ImportError as exc:
            raise SystemExit(
                "Kuzu support is missing. Install in a Python 3.12 venv with:\n"
                "  uv pip install --python .\\.venv-graphiti312\\Scripts\\python.exe graphiti-core kuzu"
            ) from exc

        db_path = os.getenv("KUZU_DB_PATH", str(MEMORY_DIR / "graphiti-kuzu"))
        driver = KuzuDriver(db=db_path)
        return Graphiti(graph_driver=driver), EpisodeType

    if backend == "falkordb":
        try:
            from graphiti_core.driver.falkordb_driver import FalkorDriver
        except ImportError as exc:
            raise SystemExit(
                "FalkorDB support is missing. Install with:\n"
                "  pip install 'graphiti-core[falkordb]'"
            ) from exc

        driver = FalkorDriver(
            host=os.getenv("FALKORDB_HOST", "localhost"),
            port=os.getenv("FALKORDB_PORT", "6379"),
            username=os.getenv("FALKORDB_USERNAME") or None,
            password=os.getenv("FALKORDB_PASSWORD") or None,
        )
        return Graphiti(graph_driver=driver), EpisodeType

    if backend != "neo4j":
        raise SystemExit(f"Unsupported AIOS_GRAPHITI_BACKEND={backend!r}")

    return (
        Graphiti(
            os.getenv("NEO4J_URI", "bolt://localhost:7687"),
            os.getenv("NEO4J_USER", "neo4j"),
            os.getenv("NEO4J_PASSWORD", "password"),
        ),
        EpisodeType,
    )


async def sync(limit: int | None = None, dry_run: bool = False) -> dict[str, Any]:
    MEMORY_DIR.mkdir(parents=True, exist_ok=True)
    state = read_json(STATE, {"schemaVersion": "aios-memory-v1", "syncedIds": []})
    synced = set(state.get("syncedIds", []))
    episodes = [ep for ep in read_jsonl(OUTBOX) if ep.get("id") not in synced]
    if limit:
        episodes = episodes[:limit]

    if dry_run:
        return {"pending": len(episodes), "synced": 0, "dryRun": True}

    graphiti, episode_type = await build_graphiti()
    synced_now: list[str] = []

    try:
        for ep in episodes:
            await graphiti.add_episode(
                name=ep.get("episodeName") or ep["id"],
                episode_body=ep.get("episodeBody") or json.dumps(ep),
                source=episode_type.text,
                source_description=ep.get("sourceDescription") or "AIOS memory episode",
                reference_time=parse_reference_time(ep.get("referenceTime")),
            )
            synced_now.append(ep["id"])
    finally:
        await graphiti.close()

    state["syncedIds"] = sorted(synced.union(synced_now))
    state["lastSyncAt"] = datetime.now(timezone.utc).isoformat()
    write_json(STATE, state)

    return {"pending": len(episodes), "synced": len(synced_now), "dryRun": False}


def backend_check() -> dict[str, Any]:
    try:
        from dotenv import load_dotenv

        load_dotenv(AIOS_ROOT / ".env")
        load_dotenv(GRAPHITI_ENV)
    except Exception:
        pass

    backend = os.getenv("AIOS_GRAPHITI_BACKEND", "kuzu").lower()

    if backend == "kuzu":
        from graphiti_core.driver.kuzu_driver import KuzuDriver

        db_path = os.getenv("KUZU_DB_PATH", str(MEMORY_DIR / "graphiti-kuzu"))
        KuzuDriver(db=db_path)
        return {
            "backend": "kuzu",
            "ready": True,
            "dbPath": db_path,
            "requiresOpenAIKeyForSync": True,
            "openAIKeyConfigured": bool(os.getenv("OPENAI_API_KEY")),
        }

    return {
        "backend": backend,
        "ready": False,
        "message": "backend-check currently validates only the embedded Kuzu backend",
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Sync AIOS memory outbox to Graphiti")
    parser.add_argument("--limit", type=int, default=None)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--backend-check", action="store_true")
    args = parser.parse_args()

    if args.backend_check:
        result = backend_check()
    else:
        result = asyncio.run(sync(limit=args.limit, dry_run=args.dry_run))
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
