import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_ROUTES = ["/signin", "/signup", "/verify-email"];
const PROTECTED_ROUTES = [""];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  //Read cookies
  const token = request.cookies.get("access_token")?.value;
  let isAuthorized = false;

  //Verify JWT
  try {
    if (token) {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
      isAuthorized = true;
    }
  } catch (error) {
    isAuthorized = false;
  }

  //Redirect Not Logged In + Trying to access dashboard
  if (!isAuthorized && PROTECTED_ROUTES.includes(path)) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  //Redirect Logged in + Trying to access signin/signup
  if (isAuthorized && PUBLIC_ROUTES.includes(path)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  //Allow everything else
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
