import { NextRequest, NextResponse } from "next/server";


export async function proxy(request: NextRequest) {
  const hasSessionCookie = request.cookies.has("access_token");
  if (!hasSessionCookie) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  return NextResponse.next();
}

export const config = {

  matcher: ["/dashboard/:path*"],
};
