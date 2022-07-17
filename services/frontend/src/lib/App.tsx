import React, { useState } from 'react';
import Postauth from "./components/Postauth"
import Preauth from "./components/Preauth/Preauth"
import { Route, Routes } from 'react-router-dom';
import Meeting from './components/Meeting/Meeting';
import useConfig from './components/context/useConfig';
import Navbar from './components/Navbar';
import BottomDecoration from './components/BottomDecoration';


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

    <BottomDecoration />
  </React.StrictMode>;
}
