import React, { useState } from 'react';
import useConfig from './useConfig';
import { useNavigate } from 'react-router-dom';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import UserPool from './UserPool';

export default function Signup() {
  const navigate = useNavigate();
  const config = useConfig();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    UserPool.signUp(email, password, [], [], (err, data) => {
      if (err) {
        setError(err.message);
      } else {
        navigate(`/${config.app.STAGE}/verify`, { state: { email } });
      }
    });
  };
  
  return <form onSubmit={onSubmit}>
    <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
    <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
    <button>Sign up</button>
    <div>{error}</div>
  </form>;
}