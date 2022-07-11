import React, { useState } from 'react';
import Home from './components/Home';
import useConfig from './components/context/useConfig';
import { Routes, Route, useParams } from 'react-router-dom';
import VerifyEmail from './components/UserAuth/VerifyEmail';
import Login from './components/UserAuth/Login';
import Signup from './components/UserAuth/Signup';
import Meeting from './components/Meeting/Meeting';
import useAccount from './components/context/useAccount';


export default function App() {
  const stage = useConfig().app.STAGE;
  const urlStart = `/${stage}/`;
  
  return <React.StrictMode>
    <Routes>
      <Route path={urlStart} element={<Home />}/>
      <Route path={`${urlStart}verify`} element={<VerifyEmail/>} />
      <Route path={`${urlStart}signup`} element={<Signup/>}/>
      <Route path={`${urlStart}login`} element={<Login/>} />
      <Route path={`${urlStart}meeting/:meetingID`} element={<Meeting/>} />
      <Route path={`${urlStart}meeting/:meetingID/:accessToken`} element={<Meeting/>} />
    </Routes>
  </React.StrictMode>;
}
