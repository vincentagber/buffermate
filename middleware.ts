import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Middleware for handling authentication and session management
 * Redirects unauthenticated users to login
 */
export async function middleware(request: NextRequest) {
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    // Create a Supabase client with the request context
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value);
            });
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    // Refresh session if needed
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Get the pathname
    const { pathname } = request.nextUrl;

    // Public routes that don't require authentication
    const publicRoutes = ["/", "/login", "/signup"];
    const isPublicRoute = publicRoutes.includes(pathname);

    // Protected routes
    const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/api/");

    // Redirect logic
    if (!session && isProtectedRoute) {
      // Redirect to login if accessing protected route without session
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (session && (pathname === "/login" || pathname === "/signup")) {
      // Redirect to dashboard if already authenticated and accessing auth pages
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    // Continue anyway on error
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
