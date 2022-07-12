import React, { useState } from 'react';
import Postauth from "./components/Postauth"
import Preauth from "./components/Preauth/Preauth"
import { Route, Routes } from 'react-router-dom';
import Meeting from './components/Meeting/Meeting';
import useConfig from './components/context/useConfig';
import Navbar from './components/Navbar';


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const config = useConfig();
  const urlStart = `/${config.app.STAGE}/`;
  
  return <React.StrictMode>
    <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
    <Routes>
      <Route path={`${urlStart}meeting/:meetingID/:accessToken`} element={<Meeting/>} />
      <Route path='*' element={isLoggedIn ?
          <Postauth/>
        :
          <Preauth setIsLoggedIn={setIsLoggedIn}/>
      }/>
    </Routes>
    {/* <Route path={urlStart} element={<Home />}/>
    <Route path={`${urlStart}verify`} element={<VerifyEmail/>} />
    <Route path={`${urlStart}signup`} element={<Signup/>}/>
    <Route path={`${urlStart}login`} element={<Login/>} />
    <Route path={`${urlStart}meeting/:meetingID`} element={<Meeting/>} /> */}
    <div className="custom-shape-divider-bottom-1657595194">
      <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
      </svg>
    </div>
  </React.StrictMode>;
}
