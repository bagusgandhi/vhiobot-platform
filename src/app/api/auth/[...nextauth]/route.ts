import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { Env } from '@/common/env';
import VhiobotApiService from '@/services/vhiobot-api.service';

const { GOOGLE_CLIENT_ID, GOOGLE_SECRET, SECRET_API_KEY } = Env;

const authOptions = {
  trustHost: true,
  pages: {
    signIn: '/admin-login',
    error: undefined,
  },
  providers: [
    CredentialsProvider({
      id: 'cred-email-password',
      name: 'custom',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'your@mail.co',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const vhiobotApi = new VhiobotApiService();
        const response = await vhiobotApi.request('/auth/admin/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          data: {
            email: credentials?.email,
            password: credentials?.password,
          },
        });

        const user = response.data;

        // console.log("credentials", credentials)
        // console.log("response", response)

        if (!user) return null;

        return user;
      },
    }),
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }: any) {
      if (account?.provider === 'google') {
        // req singin customer to vhiobot-api
        const vhiobotApi = new VhiobotApiService();
        const response = await vhiobotApi.request('/auth/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': `${SECRET_API_KEY}`,
          },
          data: {
            email: profile.email,
            name: profile.name,
          },
        });

        account.response = {
          access_token: response?.data?.access_token,
          uuid: response?.data?.user?.uuid,
          role: response?.data?.user?.role,
          profile,
        };

        return true;
      } else {
        account.response = {
          access_token: user?.access_token,
          uuid: user?.user?.uuid,
          role: user?.user?.role,
          name: user?.user?.name,
          email: user?.user?.email,
        };


        return true;
      }
    },
    async session({ session, token, user }: any) {
      session.user.name = token.account.response.name;
      session.user.email = token.account.response.email;
      session.user.uuid = token.account.response.uuid;
      session.user.role = token.account.response.role;
      session.access_token = token.account.response.access_token;

      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }: any) {
      if (account) {
        token.account = {
          ...account,
          access_token: user?.access_token, // <-- add token to JWT (Next's) object
          role: user?.role,
        };
      }
      return token;
    },
  },
  jwt: {
    maxAge: 60 * 60 * 24,
  },
};

const handlers = NextAuth(authOptions);

export { handlers as GET, handlers as POST };
