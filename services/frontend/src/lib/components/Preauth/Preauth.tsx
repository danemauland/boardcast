import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import useConfig from '../context/useConfig';
import LandingPage from './LandingPage';
import AuthForm from './AuthForm';

export default function Preauth({ setIsLoggedIn }: { setIsLoggedIn: (arg0: boolean) => any }) {
  const stage = useConfig().app.STAGE;
  const urlStart = `/${stage}/`;

  return (
    <Routes>
      <Route path={urlStart} element={<LandingPage />} />
      <Route path={`${urlStart}verify`} element={<AuthForm type="verify" setIsLoggedIn={setIsLoggedIn} />} />
      <Route path={`${urlStart}signup`} element={<AuthForm type="signup" setIsLoggedIn={setIsLoggedIn} />} />
      <Route path={`${urlStart}login`} element={<AuthForm type="login" setIsLoggedIn={setIsLoggedIn} />} />
      <Route path="*" element={<Navigate to={urlStart} replace />} />
    </Routes>
  );
}
