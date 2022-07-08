import React, {useState} from "react"
import { CognitoUser, CognitoUserPool } from "amazon-cognito-identity-js"
import { useNavigate } from "react-router-dom"
import useConfig from "./useConfig"
import UserPool from "./UserPool"

export default function VerifyEmail({user}: {user: CognitoUser | null}) {
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const config = useConfig()
  const navigate = useNavigate()

  const email = user?.getSignInUserSession()?.getIdToken()?.payload?.email

  if (!user || !email) navigate(`/${config.app.STAGE}/`)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const user = new CognitoUser({
      Username: email!,
      Pool: UserPool
    })

    user.confirmRegistration(token, false, (err, result) => {
      if(err) {
        setError(err.message)
      } else {
        navigate(`/${config.app.STAGE}/login`)
      }
    })
  }
  return <form onSubmit={handleSubmit}>
    <label>
      Please input the verification code sent to your email:
      <input type="text" value={token} onChange={e => setToken(e.target.value)}/>
      <button>Submit</button>
      <div>{error}</div>
    </label>
  </form>
}