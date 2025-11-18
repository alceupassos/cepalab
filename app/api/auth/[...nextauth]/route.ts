import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authenticator } from "otplib";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Google Authenticator",
      credentials: { code: { label: "Código TOTP", type: "text" } },
      async authorize(credentials) {
        const rawSecret = process.env.OTP_GOOGLE || process.env.TOTP_SECRET || "JBSWY3DPEHPK3PXP";
        const secret = (rawSecret || "").trim();
        const code = (credentials?.code as string || "").trim();

        authenticator.options = { window: 1 };
        const valid = authenticator.verify({ token: code, secret });
        if (!valid) return null;
        return { id: "totp-user", name: "Usuário TOTP" } as any;
      }
    })
  ],
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  pages: { signIn: "/auth/login", error: "/auth/error" },
  callbacks: {
    async jwt({ token, user }) {
      token.name = token.name || "Usuário TOTP";
      if (user) token.otpVerifiedAt = Date.now();
      return token;
    },
    async session({ session, token }) {
      session.user = { name: token.name as string } as any;
      (session as any).otpVerifiedAt = token.otpVerifiedAt as number;
      return session;
    }
  }
});

export { handler as GET, handler as POST };