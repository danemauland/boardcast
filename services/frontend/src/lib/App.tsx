import React, { useState } from 'react';
import Home from './components/Home';
import useConfig from './components/useConfig';
import { Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import VerifyEmail from './components/VerifyEmail';
import Login from './components/Login';
import Meeting from './components/Meeting';
import useAccount from './components/useAccount';


export default function App() {
  const stage = useConfig().app.STAGE;
  const urlStart = `/${stage}/`;

  const [email, setEmail] = useState<string | null>(null)

  const { getEmail } = useAccount();

  getEmail()
    .then(setEmail)

  console.log({email})
    
  
  return <React.StrictMode>
    <Routes>
      <Route path={urlStart} element={<Home email={email} />}/>
      <Route path={`${urlStart}verify`} element={<VerifyEmail/>} />
      <Route path={`${urlStart}signup`} element={<Signup/>}/>
      <Route path={`${urlStart}login`} element={<Login/>} />
      { email &&
        <Route path={`${urlStart}meeting/:meetingID`} element={<Meeting email={email}/>} />
      }
    </Routes>
  </React.StrictMode>;
}
