import React, { useEffect, useRef } from 'react';
import Message from './Message';

export default function Messages({ messages }: { messages: { text: string, email: string }[] }) {
  const endRef: React.MutableRefObject<null | HTMLDivElement> = useRef(null);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div id="messages">
      {/* fine to use array index as key here since messages don't change/aren't deleted */}
      {/* eslint-disable-next-line react/no-array-index-key */}
      {messages.map((message, i) => <Message text={message.text} email={message.email} key={i} />)}
      <div ref={endRef} />
    </div>
  );
}
