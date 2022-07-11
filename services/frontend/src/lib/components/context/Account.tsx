import React, { createContext } from 'react';
import Pool from './UserPool';
import { AuthenticationDetails, CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';


export interface AccountContext {
  authenticate: (Username: string, Password: string) => Promise<unknown>;
  getSession: () => Promise<CognitoUserSession & {user: CognitoUser} & {headers: { Authorization: string }}| null>;
  getEmail: () => Promise<string | null>
}


const authenticate = (Username: string, Password: string) => {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username, Pool });

    const authDetails = new AuthenticationDetails({ Username, Password });

    user.authenticateUser(authDetails, {
      onSuccess: resolve,
      onFailure: err => {
        console.error(err)
        reject(err)
      }
    });
  });
};

const getSession = (): Promise<CognitoUserSession & {user: CognitoUser} & {headers: { Authorization: string }}| null>  => {
  const user = Pool.getCurrentUser();
  console.log({user})
  return new Promise((resolve, reject) => {
    if (user) {
      user.getSession(async (err: Error | null, session: null | CognitoUserSession) => {
        if (err) {
          console.error(err)
          reject(err);
        } else if (session) {
          console.log({session})
          // @ts-expect-error
          const token = session.idToken.jwtToken;
          // @ts-expect-error
          resolve({
            user,
            headers: {
              Authorization: token,
            },
            ...session
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
  return session?.idToken.payload.email || null
};

export const AccountContext = createContext<AccountContext>({getEmail, getSession, authenticate});

export const Account = (props: React.PropsWithChildren) => {

  return <AccountContext.Provider value={{ authenticate, getSession, getEmail }}>
    {props.children}
  </AccountContext.Provider>;
};
