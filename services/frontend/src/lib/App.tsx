import React, { useState } from "react"
import Home from "./components/Home"
import useConfig from "./components/useConfig"
import { Routes, Route } from "react-router-dom"
import Signup from "./components/Signup"
import { ICognitoUserPoolData, CognitoUserPool, CognitoUser } from "amazon-cognito-identity-js"
import VerifyEmail from "./components/VerifyEmail"
import Login from "./components/Login"


export default function App() {
  const [user, setUser] = useState<null | CognitoUser>(null)
  const config = useConfig()
  
  return <React.StrictMode>
    <Routes>
      <Route path={`/${config.app.STAGE}/`} element={<Home user={user} Pool={userPool}/>}/>
      <Route path={`/${config.app.STAGE}/verify`} element={<VerifyEmail userPool={userPool} user={user} />} />
      <Route path={`/${config.app.STAGE}/signup`} element={<Signup userPool={userPool} setUser={setUser}/>}/>
      <Route path={`/${config.app.STAGE}/login`} element={<Login userPool={userPool} setUser={setUser} />} />
      <Route path={`/${config.app.STAGE}/meeting/:meetingID`} element={<Login userPool={userPool} setUser={setUser} />} />

    </Routes>
  </React.StrictMode>
}
