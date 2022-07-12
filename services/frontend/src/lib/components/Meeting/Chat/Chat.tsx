import React, { useEffect, useRef, useState } from 'react';
import useConfig from '../../context/useConfig';
import { Meeting, Message } from '../../../types';
import Messages from "./Messages"
import SendMessage from "./SendMessage"


type BasicMessage = Pick<Message, 'email' | 'text'>

// these were used as a placeholder, but I'm leaving them in as a little easter egg
const unusedMessages = [
  { email: 'Bill Gates', text: 'Success is a lousy teacher. It seduces smart people into thinking they can’t lose' },
  { email: 'Steve Jobs', text: "You can't just ask customers what they want and then try to give that to them. By the time you get it built, they'll want something new." },
  { email: 'Dane Mauland', text: 'Steve Jobs was a great visionary, but clearly he never envisioneed Serverless' },
];

export default function Chat({ email, meeting }: { email: string, meeting: Meeting }) {
  console.log('in chat')
  const [messages, setMessages] = useState<BasicMessage[]>(meeting.messages)
  const config = useConfig();
  const ws: React.MutableRefObject<WebSocket | null> = useRef(null);
  const meetingID = meeting.meetingDetails.meetingID

  const connectWebhook = () => {
    ws.current = new WebSocket(config.app.WEBSOCKET_URL + '?meetingID=' + meetingID + '&email=' + email);
  };

  useEffect(() => {
    console.log('inuseeffect')
    connectWebhook();
  }, []);

  useEffect(() => {
    console.log({ws: ws.current})
    if (!ws.current) return;

    // onmessage needs to be reattached each time messages changes because otherwise it's closed over the old "messages"
    ws.current.onmessage = e => {
      const message = JSON.parse(e.data) as BasicMessage;
      console.log(message);
      setMessages([...messages, message]);
    };
  }, [messages, ws.current]);


  return <div id="messages-wrapper">
    <Messages messages={messages} />
    { ws && 
      <SendMessage ws={ws} email={email} />
    }
  </div>
}