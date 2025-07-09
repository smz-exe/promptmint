import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "~/env";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    },
  );

  // Get the current user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get the current pathname
  const pathname = request.nextUrl.pathname;

  // Redirect authenticated users from root to feed
  if (pathname === "/" && user) {
    const feedUrl = new URL("/feed", request.url);
    return NextResponse.redirect(feedUrl);
  }

  // Redirect authenticated users from auth pages to feed
  const authPages = ["/sign-in", "/sign-up"];
  if (authPages.includes(pathname) && user) {
    const feedUrl = new URL("/feed", request.url);
    return NextResponse.redirect(feedUrl);
  }

  // Redirect unauthenticated users from protected routes to sign-in
  const protectedRoutes = ["/cards/create", "/settings"];
  if (protectedRoutes.includes(pathname) && !user) {
    const signInUrl = new URL("/sign-in", request.url);
    // Add redirect parameter to return to original page after sign-in
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
