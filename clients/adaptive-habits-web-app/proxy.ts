import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL;

const ACCESS_TOKEN_NAME = "__session";
const REFRESH_TOKEN_NAME = "_r";

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN_NAME)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_NAME)?.value;
  const publicPaths = ["/login", "/register"];
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname);
  const forceRefresh = request.nextUrl.searchParams.get("refresh") === "true";

  if (accessToken && !forceRefresh) {
    if (isPublicPath) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (refreshToken) {
    return await refresh(refreshToken, forceRefresh, request.url);
  }

  if (!isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

async function refresh(
  refreshToken: string,
  forceRefresh: boolean,
  url: string
) {
  try {
    const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        Cookie: `${REFRESH_TOKEN_NAME}=${refreshToken}`,
      },
    });

    if (refreshRes.ok) {
      let response: NextResponse;

      if (forceRefresh) {
        const cleanUrl = new URL(url);
        cleanUrl.searchParams.delete("refresh");
        response = NextResponse.redirect(cleanUrl);
      } else {
        response = NextResponse.next();
      }

      const setCookieHeaderValues = refreshRes.headers.getSetCookie();

      setCookieHeaderValues.forEach((cookieStr) => {
        const [nameValue] = cookieStr.split(";");
        const [name, value] = nameValue.split("=");
        if (name && value) {
          const trimmedName = name.trim();
          const trimmedValue = value.trim();

          response.cookies.set({
            name: trimmedName,
            value: trimmedValue,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          });
        }
      });

      return response;
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|manifest.webmanifest|favicon.ico|.*\\.png$).*)",
  ],
};
