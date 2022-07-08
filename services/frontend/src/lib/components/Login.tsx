import React, { useContext, useState } from "react"
import useConfig from "./useConfig"
import { useNavigate } from "react-router-dom"
import { AccountContext } from "./Account"



export default function Login({setUser}: {setUser: Function}) {
  const navigate = useNavigate()
  const config = useConfig()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { authenticate } = useContext(AccountContext)
    
      onFailure: function (err) {
        if (err.name === "UserNotConfirmedException") {
          navigate(`/${config.app.STAGE}/verify`)
        } else {
          setError(err.message)
        }
      },
    
  
  return <form onSubmit={onSubmit}>
    <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
    <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
    <button>Log in</button>
    <div>{error}</div>
  </form>
}