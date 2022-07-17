import { CognitoUser } from 'amazon-cognito-identity-js';
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAccount from '../context/useAccount';
import useConfig from '../context/useConfig';
import UserPool from '../context/UserPool';

export default function AuthForm({ type, setIsLoggedIn }: { type: 'signup' | 'login' | 'verify', setIsLoggedIn: (arg0: boolean) => any }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const config = useConfig();
  const urlStart = `/${config.app.STAGE}/`;
  const { authenticate } = useAccount();
  const state = useLocation().state as { email: string };

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    UserPool.signUp(email, password, [], [], (err) => {
      if (err) {
        setError(err.message);
      } else {
        navigate(`/${config.app.STAGE}/verify`, { state: { email } });
      }
    });
    setPassword('');
    setEmail('');
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    authenticate(email, password)
      .then(() => {
        setIsLoggedIn(true);
        navigate(`/${config.app.STAGE}/`);
      })
      .catch((err) => {
        if (err.name === 'UserNotConfirmedException') {
          navigate(`/${config.app.STAGE}/verify`, { state: { email } });
        } else {
          setError(err.message);
        }
      });
    setPassword('');
    setEmail('');
  };

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = new CognitoUser({
      Username: state.email,
      Pool: UserPool,
    });

    user.confirmRegistration(password, false, (err) => {
      if (err) {
        setError(err.message);
      } else {
        navigate(`/${config.app.STAGE}/login`);
      }
    });
    setPassword('');
  };

  let submitHandler;
  let buttonLabel;
  if (type === 'signup') {
    submitHandler = handleSignup;
    buttonLabel = 'Create account';
  } else if (type === 'login') {
    submitHandler = handleLogin;
    buttonLabel = 'Sign in';
  } else {
    submitHandler = handleVerify;
    buttonLabel = 'Submit';
  }

  return (
    <div id="auth-page-wrapper">
      <div id="auth-form-wrapper">
        <form id="auth-form" onSubmit={submitHandler}>
          <h2>{type === 'verify' ? 'Please enter the code sent to your email' : 'Get ready to boardcast'}</h2>
          <div id="inside-auth-form-wrapper">
            <div id="auth-input-wrapper">
              {type !== 'verify' && <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />}
              <input type="password" placeholder={type === 'verify' ? 'Verification Code' : 'Password'} value={password} onChange={(e) => setPassword(e.target.value)} />
              <span id="error">{error}</span>
              <button type="submit">{buttonLabel}</button>
              { type !== 'verify' && (type === 'signup'
                ? (
                  <span>
                    Already have an account?
                    <Link to={`${urlStart}login`}>Sign in</Link>
                  </span>
                )
                : (
                  <span>
                    New to Boardcast?
                    <Link to={`${urlStart}signup`}>Sign up</Link>
                  </span>
                )
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
