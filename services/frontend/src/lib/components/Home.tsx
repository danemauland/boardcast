import { Link } from "react-router-dom"
import React, { useState } from "react"
import { CognitoUser, CognitoUserPool, CognitoUserSession } from "amazon-cognito-identity-js"
import { useEffect } from "react"
import Dashboard from "./Dashboard"

export default function Home({ user, Pool }: { user: CognitoUser | null, Pool: CognitoUserPool }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(user)

  useEffect(() => {
    const user = Pool.getCurrentUser();
    if (user) {
      user.getSession((err: Error, session: CognitoUserSession | null) => {
        if (!err) {
          setCurrentUser(user)
          setIsLoggedIn(true)
        } else {
          console.error(err)
        }
      });
    }
  }, [])
  console.log({currentUser})
  return <div>
    {
      isLoggedIn && currentUser ?
        <Dashboard email={currentUser.getSignInUserSession()?.getIdToken().payload.email}/>
      :
      <>
        <Link to="signup">Sign up</Link>
        <Link to="login">Log in</Link>
      </>
    }
  </div>
}