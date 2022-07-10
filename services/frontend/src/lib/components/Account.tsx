import React, { createContext } from 'react';
import Pool from './UserPool';
import { AuthenticationDetails, CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';


export interface AccountContext {
  authenticate: (Username: string, Password: string) => Promise<unknown>;
  getSession: () => Promise<CognitoUserSession | null>;
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

const getSession = (): Promise<CognitoUserSession | null>  => {
  const user = Pool.getCurrentUser();
  return new Promise((resolve, reject) => {
    if (user) {
      user.getSession((err: Error | null, session: null | CognitoUserSession) => {
        if (err) {
          console.error(err)
          reject(err);
        } else {
          resolve(session);
        }
      });
    } else {
      resolve(null);
    }
  });
};

const getEmail = async (): Promise<string | null> => {
  const session = await getSession();
  return session?.getIdToken().payload.email || null
};

export const AccountContext = createContext<AccountContext>({getEmail, getSession, authenticate});

export const Account = (props: React.PropsWithChildren) => {

  return <AccountContext.Provider value={{ authenticate, getSession, getEmail }}>
    {props.children}
  </AccountContext.Provider>;
};
