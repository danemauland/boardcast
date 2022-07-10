import React from 'react';

import Chat from './Chat';

export default function Meeting({email}: {email: string}) {
  console.log('in Meeting')
  return <Chat email={email}></Chat>;
}