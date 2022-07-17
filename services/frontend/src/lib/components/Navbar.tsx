import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import useConfig from './context/useConfig';
import UserPool from './context/UserPool';
import LandingPageLinks from './Preauth/LandingPageLinks';

export default function NavBar(
  { isLoggedIn, setIsLoggedIn }: { isLoggedIn: boolean, setIsLoggedIn: (arg0: boolean) => any },
) {
  const config = useConfig();
  const urlStart = `/${config.app.STAGE}/`;

  const logout = () => {
    const user = UserPool.getCurrentUser();
    user?.signOut();
    setIsLoggedIn(false);
  };

  return (
    <div id="navbar">
      <div>
        <Link id="logo" to={urlStart}>Boardcast</Link>
        <div id="right-navbar-wrapper">
          { isLoggedIn
            ? <div><Link to={urlStart} onClick={logout}>Logout</Link></div>
            : (
              <Routes>
                <Route path={urlStart} element={<LandingPageLinks />} />
                <Route path={`${urlStart}signup`} element={<div><Link to={`${urlStart}login`}>Sign in</Link></div>} />
                <Route path={`${urlStart}login`} element={<div><Link to={`${urlStart}signup`}>Create account</Link></div>} />
              </Routes>
            )}
        </div>
      </div>
    </div>
  );
}
