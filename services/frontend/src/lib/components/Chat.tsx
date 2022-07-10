import React, { useEffect, useRef, useState } from 'react';
import Messages from './Messages';
import SendMessage from './SendMessage';
import useConfig from './useConfig';
import $ from 'jquery';
import { useParams } from 'react-router-dom';

export default function Chat({ email }: { email: string }) {
  console.log('in chat')
  const config = useConfig();
  const ws: React.MutableRefObject<WebSocket | null> = useRef(null);
  const meetingID = useParams().meetingID;
  const [messages, setMessages] = useState([
    { email: 'Bill Gates', text: 'Success is a lousy teacher. It seduces smart people into thinking they can’t lose' },
    { email: 'Steve Jobs', text: "You can't just ask customers what they want and then try to give that to them. By the time you get it built, they'll want something new." },
    { email: 'Dane Mauland', text: 'Steve Jobs was a great visionary, but clearly he never envisioneed Serverless' },
  ]);

  const connectWebhook = () => {
    ws.current = new WebSocket(config.app.WEBSOCKET_URL + '?meetingID=' + meetingID + '&email=' + email);
  };

  const fetchMessages = async () => {
    console.log('fetching')
    const resp = await $.ajax(`${config.app.URL}/meeting/${meetingID}/messages`, {
      method: 'GET',
      contentType: 'application/json; charset=utf-8',
    });
    console.log(JSON.parse(resp));
    setMessages(JSON.parse(resp));
  };

  useEffect(() => {
    console.log('inuseeffect')
    connectWebhook();
    fetchMessages();
  }, []);

  useEffect(() => {
    console.log({ws: ws.current})
    if (!ws.current) return;

    // onmessage needs to be reattached each time messages changes because otherwise its closed over the old "messages"
    ws.current.onmessage = e => {
      const message = JSON.parse(e.data) as { text: string, email: string };
      console.log(message);
      setMessages([...messages, message]);
    };
  }, [messages, ws.current]);


  return <>
    <Messages messages={messages} />
    { ws && 
      <SendMessage ws={ws} email={email} />
    }
  </>;
}