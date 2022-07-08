import React, { useEffect, useRef, useState } from "react"
import Messages from "./Messages"
import SendMessage from "./SendMessage"
import useConfig from "./useConfig"
import $ from "jquery"


export default function Chat({meetingID, email}: {meetingID: string, email: string}) {
  const config = useConfig();
  const ws: React.MutableRefObject<WebSocket | null> = useRef(null)

  const [messages, setMessages] = useState([
    { email: "Bill Gates", text: "Success is a lousy teacher. It seduces smart people into thinking they can’t lose" },
    { email: "Steve Jobs", text: "You can't just ask customers what they want and then try to give that to them. By the time you get it built, they'll want something new." },
    { email: "Dane Mauland", text: "Steve Jobs was a great visionary, but clearly he never envisioneed Serverless" }
  ])

  useEffect(() => {
    ws.current = new WebSocket(config.app.WEBSOCKET_URL + '?meetingID=' + meetingID + '&email=' + email)
    fetchMessages()
  }, [])

  useEffect(() => {
    if (!ws.current) return;
    console.log('setting up onmessage')

    ws.current.onmessage = e => {
      const message = JSON.parse(e.data) as { text: string, email: string }
      console.log(message)
      setMessages([...messages, message])
    }
  }, [messages])

  const fetchMessages = async () => {
    const resp = await $.ajax(`${config.app.URL}/meeting/${meetingID}/messages`, {
      method: "GET",
      contentType: "application/json; charset=utf-8",
    })
    console.log(JSON.parse(resp))
    setMessages(JSON.parse(resp))
  }

  return <>
    <Messages messages={messages} />
    <SendMessage ws={ws} email={email} />
  </>
}