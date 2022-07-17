import React from 'react';
import { Link } from 'react-router-dom';
import useConfig from '../context/useConfig';

export default function LandingPageLinks() {
  const config = useConfig();
  const urlStart = `/${config.app.STAGE}/`;

  return (
    <>
      <div>
        <a href="https://www.linkedin.com/in/danemauland/">LinkedIn</a>
        <a href="https://github.com/danemauland">GitHub</a>
      </div>
      <div>
        <Link to={`${urlStart}signup`}>Get Started</Link>
        <Link to={`${urlStart}login`}>Sign In</Link>
      </div>
    </>
  );
}
