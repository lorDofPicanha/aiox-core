import { NextResponse } from "next/server";

export function GET() {
  return new NextResponse(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#0B1F3A"/><path d="M9 22V10h3.2l7.6 8.1V10H23v12h-3.1l-7.7-8.2V22H9Z" fill="#F8FAFC"/></svg>',
    {
      headers: {
        "content-type": "image/svg+xml",
        "cache-control": "public, max-age=86400",
      },
    },
  );
}
