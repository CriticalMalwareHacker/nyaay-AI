import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// These logs will appear in your server terminal when this file is loaded correctly.
console.log("--- Loading NextAuth Configuration ---");
console.log("GOOGLE_CLIENT_ID loaded:", process.env.GOOGLE_CLIENT_ID ? "Exists" : "MISSING!");
console.log("GOOGLE_CLIENT_SECRET loaded:", process.env.GOOGLE_CLIENT_SECRET ? "Exists" : "MISSING!");
console.log("NEXTAUTH_SECRET loaded:", process.env.NEXTAUTH_SECRET ? "Exists" : "MISSING!");
console.log("------------------------------------");

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope:
            "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive.file",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session as any).accessToken = token.accessToken;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

