import { NextResponse } from "next/server";
import { saveAnalytics } from "@/models/analytics";

export async function middleware(req) {
  const { nextUrl, geo } = req;
  const userAgent = req.headers.get("user-agent") || "";
  const ip = req.headers.get("x-forwarded-for") || req.ip;

  await saveAnalytics({
    url: nextUrl.pathname,
    ip,
    location: geo,
    userAgent,
    event: "visit",
    timestamp: new Date(),
  });

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",  
};
