import React, { useEffect, useRef } from 'react';
import Message from './Message';

export default function ({ messages }: { messages: { text: string, email: string }[] }) {
  const endRef: React.MutableRefObject<null | HTMLDivElement> = useRef(null);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  return <div id="messages">
    {messages.map((message, i) => <Message text={message.text} email={message.email} key={i}/>)}
    <div ref={endRef} />
  </div>
}