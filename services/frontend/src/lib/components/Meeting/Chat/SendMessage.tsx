import React, { useRef, useState } from 'react';

export default function SendMessage(
  { ws, email }: { ws: WebSocket | null, email: string },
) {
  const [messageText, setMessageText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ws) return;
    ws.send(JSON.stringify({ action: 'sendMessage', text: messageText, email }));
    setMessageText('');
  };

  const formRef: React.MutableRefObject<null | HTMLFormElement> = useRef(null);
  const onEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey === false) {
      e.preventDefault();
      formRef.current!.requestSubmit();
    }
  };

  return (
    <form id="send-message" ref={(el) => { formRef.current = el; }} onSubmit={handleSubmit}>
      <div id="send-message-container">
        <textarea
          onChange={(e) => setMessageText(e.target.value)}
          value={messageText}
          onKeyDown={onEnterPress}
        />
        <button type="submit"><span>Send</span></button>
      </div>
    </form>
  );
}
