import React, { createContext, ReactNode, useMemo } from 'react';
import { AuthenticationDetails, CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';
import Pool from './UserPool';

type Session = CognitoUserSession & { user: CognitoUser } & { headers: { Authorization: string } };

export interface AccountContextInterface {
  authenticate: (Username: string, Password: string) => Promise<unknown>;
  getSession: () => Promise< Session | null>;
  getEmail: () => Promise<string | null>
}

const authenticate = (Username: string, Password: string) => new Promise((resolve, reject) => {
  const user = new CognitoUser({ Username, Pool });

  const authDetails = new AuthenticationDetails({ Username, Password });

  user.authenticateUser(authDetails, {
    onSuccess: resolve,
    onFailure: reject,
  });
});

const getSession = (): Promise<Session | null> => {
  const user = Pool.getCurrentUser();
  return new Promise((resolve, reject) => {
    if (user) {
      user.getSession(async (err: Error | null, session: null | CognitoUserSession) => {
        if (err) {
          reject(err);
        } else if (session) {
          // @ts-expect-error
          const token = session.idToken.jwtToken;
          // @ts-expect-error
          resolve({
            user,
            headers: {
              Authorization: token,
            },
            ...session,
          });
        }
      });
    } else {
      resolve(null);
    }
  });
};

const getEmail = async (): Promise<string | null> => {
  const session = await getSession();
  // @ts-expect-error
  return session?.idToken.payload.email || null;
};

export const AccountContext = createContext<AccountContextInterface>({
  getEmail,
  getSession,
  authenticate,
});

export function Account({ children }: { children: ReactNode }) {
  const functions = useMemo(() => ({ authenticate, getSession, getEmail }), []);

  return (
    <AccountContext.Provider value={functions}>
      {children}
    </AccountContext.Provider>
  );
}
