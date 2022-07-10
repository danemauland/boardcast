import { Link } from 'react-router-dom';
import React, { useContext, useState } from 'react';
import Dashboard from './Dashboard';
import useAccount from './useAccount';

export default function Home({email}: {email: string | null}) {
  return <div>
    { email ?
        <Dashboard email={email}/>
      :
        <>
          <Link to="signup">Sign up</Link>
          <Link to="login">Log in</Link>
        </>
    }
  </div>;
}