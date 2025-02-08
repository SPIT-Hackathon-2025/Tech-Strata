import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      if (req.nextUrl.pathname.startsWith("/dashboard") || req.nextUrl.pathname.startsWith("/code")) {
        return !!token
      }
      return true
    },
  },
})

export const config = {
  matcher: ["/dashboard/:path*", "/code/:path*"]
}