import { NextResponse, type NextRequest } from "next/server";

const ADMIN_COOKIE_NAME = "lr_admin";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const expectedToken = process.env.ADMIN_SESSION_TOKEN;
  if (!expectedToken) {
    if (process.env.NODE_ENV === "production") {
      return new NextResponse(
        "Admin paneli yapilandirilmamis. Sunucu yoneticisine basvurun.",
        { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } }
      );
    }
    return NextResponse.next();
  }

  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (cookie === expectedToken) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin-giris";
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
