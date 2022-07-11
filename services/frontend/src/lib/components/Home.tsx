import { Link } from 'react-router-dom';
import React, { useContext, useState } from 'react';
import Dashboard from './Dashboard';
import useAccount from './context/useAccount';

export default function Home() {

  // can't use email from App because logging in sets email without retriggering context
  const [email, setEmail] = useState<string | null>(null)

  const { getEmail } = useAccount();

  getEmail()
    .then(setEmail)

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