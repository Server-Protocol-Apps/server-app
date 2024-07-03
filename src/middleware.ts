import { getSession, updateSession } from "@/session";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  await updateSession(request);
  const currentUser = await getSession();
  if (!currentUser && !request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
