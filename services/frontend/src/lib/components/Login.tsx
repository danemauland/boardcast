import React, { useState } from "react"
import useConfig from "./useConfig"
import { useNavigate } from "react-router-dom"
import { CognitoUserPool, CognitoUserAttribute, AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js"

export default function Login({setUser, userPool}: {setUser: Function, userPool: CognitoUserPool}) {
  const navigate = useNavigate()
  const config = useConfig()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const authenticationData = {
      Username: email,
      Password: password,
    }

    const authenticationDetails = new AuthenticationDetails(authenticationData)

    const userData = {
      Username: email,
      Pool: userPool
    }

    const user = new CognitoUser(userData)

    user.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        setUser(user)
      },

      onFailure: function (err) {
        if (err.name === "UserNotConfirmedException") {
          navigate(`/${config.app.STAGE}/verify`)
        } else {
          setError(err.message)
        }
      },
    });
  }
  
  return <form onSubmit={onSubmit}>
    <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
    <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
    <button>Log in</button>
    <div>{error}</div>
  </form>
}