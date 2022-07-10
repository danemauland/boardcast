import { CognitoUser } from 'amazon-cognito-identity-js';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AccountContext } from './Account';
import useConfig from './useConfig';
import UserPool from './UserPool';

export default function VerifyEmail() {
  const [token, setToken] = useState('');
  const [error, setError] = useState(null);
  const config = useConfig();
  const navigate = useNavigate();
  const state = useLocation().state as {email: string}
  const email = state.email

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = new CognitoUser({
      Username: email,
      Pool: UserPool
    })

    user.confirmRegistration(token, false, (err, result) => {
      if (err) {
        setError(err.message);
      } else {
        navigate(`/${config.app.STAGE}/login`);
      }
    });
  };

  return <form onSubmit={handleSubmit}>
    <label>
      Please input the verification code sent to your email:
      <input type="text" value={token} onChange={e => setToken(e.target.value)}/>
      <button>Submit</button>
      <div>{error}</div>
    </label>
  </form>;
}