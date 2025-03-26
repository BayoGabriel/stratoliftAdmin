// api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb"; // Ensure this is correctly implemented
import User from "@/models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide both email and password.");
        }

        try {
          await dbConnect();
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            throw new Error("No user found with this email.");
          }

          const isMatch = await bcrypt.compare(credentials.password, user.password);
          if (!isMatch) {
            throw new Error("Invalid password.");
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            address: user.address,
            school: user.school,
            isAdmin: user.isAdmin,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error("Something went wrong. Please try again.");
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      return user ? true : false;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.address = user.address;
        token.school = user.school;
        token.isAdmin = user.isAdmin;
      }

      // Handle updates dynamically
      if (trigger === "update" && session) {
        token.address = session.address || token.address;
        token.school = session.school || token.school;
        token.isAdmin = session.isAdmin ?? token.isAdmin;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.address = token.address;
        session.user.school = token.school;
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },
  },
  pages: {
    error: "/", // Redirect to homepage on authentication errors
  },
  session: {
    strategy: "jwt",
    maxAge: 6 * 60 * 60, // 6 hours session expiry
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
