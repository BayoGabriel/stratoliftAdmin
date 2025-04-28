import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectMongo from "@/lib/mongodb";
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
          await connectMongo();
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            throw new Error("No user found with this email.");
          }

          if (user.status !== 'Active') {
            throw new Error("Account is inactive. Please contact support.");
          }

          const isMatch = await bcrypt.compare(credentials.password, user.password);
          if (!isMatch) {
            throw new Error("Invalid password.");
          }

          return {
            id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            address: user.address,
            image: user.image,
            role: user.role,
            status: user.status,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error(error.message || "Something went wrong. Please try again.");
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
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.email = user.email;
        token.address = user.address;
        token.image = user.image;
        token.role = user.role;
        token.status = user.status;
      }

      // Handle updates dynamically
      if (trigger === "update" && session) {
        Object.keys(session).forEach(key => {
          if (session[key] !== undefined) {
            token[key] = session[key];
          }
        });
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.email = token.email;
        session.user.address = token.address;
        session.user.image = token.image;
        session.user.role = token.role;
        session.user.status = token.status;
      }
      return session;
    },
  },
  pages: {
    signIn: "/", // Redirect to homepage for sign in
    error: "/", // Redirect to homepage on authentication errors
  },
  session: {
    strategy: "jwt",
    maxAge: 360 * 24 * 60 * 60, // 360 days (12 months) session expiry
  },  
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
