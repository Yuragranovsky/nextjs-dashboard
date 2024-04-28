import type { NextAuthConfig } from 'next-auth';
 
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = request.nextUrl.pathname.startsWith('/dashboard');
      let result: boolean | Response = true;
      if (isOnDashboard) {
        result = isLoggedIn// Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        result =  Response.redirect(new URL('/dashboard', request.nextUrl));
      }
      return result;
    },
  },
  providers: [], // Add providers with an empty array for now
} ;