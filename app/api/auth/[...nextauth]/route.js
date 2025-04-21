import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,        // GitHub OAuth client ID
      clientSecret: process.env.GITHUB_SECRET, // GitHub OAuth client secret
      scope: 'read:user user:email repo',     // Optional: Define the scope for permissions (GitHub API)
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // Secret for encoding JWT

  callbacks: {
    // Handle JWT callback to store access token
    async jwt({ token, account }) {
      // If it's the first time logging in (or during login), store the GitHub access token
      if (account && account.access_token) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token; // Store refresh token for future use if available
      }
      return token;
    },

    // Handle session callback to pass access token into the session object
    async session({ session, token }) {
      // Make sure to pass the access token from JWT to session
      if (token.accessToken) {
        session.accessToken = token.accessToken;
      }
      if (token.refreshToken) {
        session.refreshToken = token.refreshToken; // Include refresh token if available
      }
      return session;
    },
  },

  // Optionally, you can set up a session duration and JWT expiry
  session: {
    jwt: true,
  },
  pages: {
    signIn: '/auth/signin',  // Custom sign-in page (optional)
  },
};

// Export the handler to handle both GET and POST requests for NextAuth
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
