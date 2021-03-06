import React from 'react';

export default function Message({ text, email }: { text: string, email: string }) {
  return (
    <div>
      <span style={{ color: 'blue' }}>{`${email}: `}</span>
      {text}
    </div>
  );
}
