import React, { createContext } from "react"
import Pool from "./UserPool"
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js"

const authenticate = async (Username: string, Password: string) => {
  await new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username, Pool })

    const authDetails = new AuthenticationDetails({ Username, Password })

    user.authenticateUser(authDetails, {
      onSuccess: resolve,
      onFailure: reject
    })
  })
};

const AccountContext = createContext(authenticate)


const Account = (props: React.PropsWithChildren) => {

  return <AccountContext.Provider value={authenticate}>
    {props.children}
  </AccountContext.Provider>
}

export { Account, AccountContext}