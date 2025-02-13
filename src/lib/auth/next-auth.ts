import { type AuthOptions, getServerSession } from "next-auth";
import { eq, or } from "drizzle-orm";
import { type User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { db } from "@/src/db";
import { users } from "@/src/db/schemas";
import {
  JWT,
  encode,
  decode,
  JWTDecodeParams,
  JWTEncodeParams,
} from "next-auth/jwt";
import { UserInsert } from "@/src/types";

interface CustomUser extends User {
  id: string;
  role_id: number;
  auth_type: UserInsert["auth_type"];
  username: string;
  avatar: string;
}
function checkUserAuthType(
  user: CustomUser,
  provider: "google" | "github" | "credentials"
) {
  if (user.auth_type === "local" && provider !== "credentials") {
    return "This account was created with a different provider. Please sign in with the same provider.";
  }
  if (provider !== "credentials" && user.auth_type !== provider) {
    return "This account was created with a different provider. Please sign in with the same provider.";
  }
  return false;
}
const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          avatar: profile.picture,
          username: profile.email.split("@")[0],
          auth_type: "google",
          role_id: 5,
          image: profile.picture,
        } as CustomUser;
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      profile(profile) {
        return {
          id: profile.id?.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          avatar: profile.avatar_url,
          username: profile.login,
          auth_type: "github",
          role_id: 5,
          image: profile?.avatar_url,
        } as CustomUser;
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        emailOrUsername: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.emailOrUsername || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await db.query.users.findFirst({
          where: or(
            eq(users.username, credentials.emailOrUsername),
            eq(users.email, credentials.emailOrUsername)
          ),
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return {
          name: user.name,
          email: user.email,
          id: user?.auth_id,
          image: user.avatar as string,
          role_id: user.role_id,
        } as CustomUser;
      },
    }),
  ],
  jwt: {
    async encode(params: JWTEncodeParams): Promise<string> {
      if (params.token === undefined) {
        throw new Error("Token is undefined");
      }
      return await encode({
        token: params.token,
        secret: params.secret,
        maxAge: params.maxAge,
      });
    },
    async decode(params: JWTDecodeParams): Promise<JWT | null> {
      if (params.token === undefined) {
        return null;
      }
      return await decode({
        secret: params.secret,
        token: params.token,
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, user.email),
      });

      if (existingUser) {
        // Skip email verification for OAuth providers
        if (account?.provider !== "credentials") {
          return true;
        }

        // Check email verification for credentials login
        if (!existingUser.email_verified) {
          throw new Error("Please verify your email before signing in");
        }

        const authTypeCheck = checkUserAuthType(
          user as CustomUser,
          account?.provider as "google" | "github" | "credentials"
        );
        if (authTypeCheck) {
          throw new Error(authTypeCheck);
        }
        return true;
      }

      if (!existingUser && account?.provider !== "credentials") {
        await db.insert(users).values({
          email: user.email,
          name: user.name,
          username: (user as CustomUser).username,
          avatar: (user as CustomUser).avatar,
          auth_type: (user as CustomUser).auth_type,
          role_id: (user as CustomUser).role_id,
          auth_id: (user as CustomUser).id,
          email_verified: true, // OAuth providers are pre-verified
        });
        return true;
      }

      throw new Error("Account not found. Please sign up.");
    },

    async jwt({ token, user, account, trigger }) {
      return {
        ...token,
        id: user?.id || (token?.sub as string),

        role_id: user?.role_id || (token?.role_id as number),
      };
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token?.id,

          role_id: token?.role_id,
        },
      };
    },
  },
};

const getSession = () => getServerSession(authOptions);

export { authOptions, getSession };
