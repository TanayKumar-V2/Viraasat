import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                await dbConnect();
                const user = await User.findOne({ email: credentials.email });

                if (!user || !user.password) {
                    throw new Error("Invalid credentials");
                }

                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isCorrectPassword) {
                    throw new Error("Invalid credentials");
                }

                return user;
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                try {
                    await dbConnect();
                    // Check if user exists
                    let dbUser = await User.findOne({ email: user.email });

                    if (!dbUser) {
                        // Create user in DB for Google users
                        dbUser = await User.create({
                            name: user.name,
                            email: user.email,
                            role: "user", // Default role
                        });
                    }

                    // Attach DB ID and role to the NextAuth user object
                    // so the jwt callback can access it immediately
                    user.id = dbUser._id.toString();
                    user.role = dbUser.role;
                    return true;
                } catch (error) {
                    console.error("Error saving Google user to DB:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, trigger, session }) {
            // Initial sign in
            if (user) {
                // For credentials, user already contains the DB document from authorize()
                // For Google, user now contains the decorated fields from signIn()
                token.sub = user.id;
                token.role = user.role;
            }

            // Optional: allow updating role without relogging
            if (trigger === "update" && session?.user?.role) {
                token.role = session.user.role;
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
