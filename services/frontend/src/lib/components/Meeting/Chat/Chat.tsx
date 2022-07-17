import React, { useEffect, useState } from 'react';
import useConfig from '../../context/useConfig';
import { Meeting, Message } from '../../../types';
import Messages from './Messages';
import SendMessage from './SendMessage';

type BasicMessage = Pick<Message, 'email' | 'text'>;

// these were used as a placeholder, but I'm leaving them in as a little easter egg
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const unusedMessages = [
  { email: 'Bill Gates', text: 'Success is a lousy teacher. It seduces smart people into thinking they can’t lose' },
  { email: 'Steve Jobs', text: "You can't just ask customers what they want and then try to give that to them. By the time you get it built, they'll want something new." },
  { email: 'Dane Mauland', text: 'Steve Jobs was a great visionary, but clearly he never envisioneed Serverless' },
];

const connectWebsocket = (url: string, meetingID: string, email: string) => {
  const fullUrl = `${url}?meetingID=${meetingID}&email=${email}`;
  return new WebSocket(fullUrl);
};

export default function Chat({ email, meeting }: { email: string, meeting: Meeting }) {
  const [messages, setMessages] = useState<BasicMessage[]>(meeting.messages);
  const config = useConfig();
  const [ws, setWS] = useState<WebSocket | null>(null);
  const meetingID = meeting.meetingDetails.meetingID;

  useEffect(() => {
    setWS(connectWebsocket(config.app.WEBSOCKET_URL, meetingID, email));
  }, [config.app.WEBSOCKET_URL, meetingID, email]);

  useEffect(() => {
    if (!ws) return;

    // onmessage needs to be reattached each time messages changes
    // because otherwise it's closed over the old "messages"
    ws.onmessage = (e) => {
      const message = JSON.parse(e.data) as BasicMessage;
      setMessages([...messages, message]);
    };
  }, [messages, ws]);

  return (
    <div id="messages-wrapper">
      <Messages messages={messages} />
      { ws
      && <SendMessage ws={ws} email={email} />}
    </div>
  );
}
