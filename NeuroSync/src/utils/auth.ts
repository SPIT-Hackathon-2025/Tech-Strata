import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "../db/connectDB";
import User from "../models/user";
import bcryptjs from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }
        console.log("first")
        try {
          await connectDB();
          const user = await User.findOne({ email: credentials.email }).select(
            "+password"
          );

          if (!user) {
            throw new Error("User not found with this email 😥");
          }

          const isPasswordMatched = await bcryptjs.compare(
            credentials.password,
            user.password
          );
          console.log(credentials.password)
          console.log(user.password)

          if (!isPasswordMatched) {
            throw new Error("Password is incorrect 😥");
          }
          return {
            id: user._id.toString(),
            email: user.email,
            username: user.username,
            fullName: user.fullName,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          throw new Error("Authorization failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.fullName = user.fullName;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXT_AUTH_SECRET,
};
