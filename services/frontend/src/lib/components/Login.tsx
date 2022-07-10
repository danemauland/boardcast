import React, { useContext, useState } from 'react';
import useConfig from './useConfig';
import { useNavigate } from 'react-router-dom';
import { AccountContext } from './Account';

export default function Login() {
  const navigate = useNavigate();
  const config = useConfig();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { authenticate } = useContext(AccountContext)!;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    authenticate(email, password)
      .then(() => {
          navigate(`/${config.app.STAGE}/`);
      })
      .catch(err => {
        if (err.name === 'UserNotConfirmedException') {
          navigate(`/${config.app.STAGE}/verify`, { state: { email }});
        } else {
          setError(err.message);
        }
    });
  };
  
  return <form onSubmit={onSubmit}>
    <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
    <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
    <button>Log in</button>
    <div>{error}</div>
  </form>;
}