import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { Env } from "@/common/env";
import { z } from 'zod';
import { signIn } from "next-auth/react";
import VhiobotApiService from "@/services/vhiobot-api.service";

const { GOOGLE_CLIENT_ID, GOOGLE_SECRET, SECRET_API_KEY } = Env;


const authOptions = {
    providers: [
        GoogleProvider({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_SECRET,
        })
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
                        'api-key': `${SECRET_API_KEY}`
                    },
                    data: {
                        email: profile.email,
                        name: profile.name
                    }
                })

                account.response = {
                    access_token: response?.data?.access_token,
                    uuid: response?.data?.user?.uuid,
                    role: response?.data?.user?.role
                };

                return true;

            }

            return true;
        },
        jwt({ token, user, account, profile, isNewUser }: any) {
            if (account) {
                token.account = {
                    ...account,
                    access_token: user?.access_token, // <-- add token to JWT (Next's) object
                    role: user?.role
                };
            }
            return token;
        },
        session({ session, token }: any) {
            session.user = {...session.user, ...token.account.response}
            return session;
        }
    },
    jwt: {
        maxAge: 60 * 60 * 24
    }
}

const handlers = NextAuth(authOptions);

export { handlers as GET, handlers as POST };