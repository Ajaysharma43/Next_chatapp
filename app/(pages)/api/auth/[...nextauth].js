import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
        console.log("Session Callback:", session, token);
        session.user.id = token.sub;
        return session;
      },
      async jwt({ token, user }) {
        console.log("JWT Callback:", token, user);
        if (user) token.id = user.id;
        return token;
      },
  },
});
