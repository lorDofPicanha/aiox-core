import { describe, expect, it } from "vitest";
import { safeInternalPath } from "@/lib/auth/redirect";

describe("safeInternalPath", () => {
  it.each([null, undefined, "", "https://evil.example", "//evil.example", "javascript:alert(1)"])(
    "rejects unsafe value %s",
    (value) => expect(safeInternalPath(value)).toBe("/"),
  );

  it.each([
    ["/", "/"],
    ["/vencimentos", "/vencimentos"],
    ["/relatorios?year=2026#totals", "/relatorios?year=2026#totals"],
  ])("accepts internal path %s", (value, expected) => {
    expect(safeInternalPath(value)).toBe(expected);
  });
});
