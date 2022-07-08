import React, { useRef, useState } from "react"

export default function({ws, email}: {ws: React.MutableRefObject<WebSocket | null>, email: string}) {
  const [messageText, setMessageText] = useState('')
  const formRef: React.MutableRefObject<null | HTMLFormElement> = useRef(null)


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ws.current) return;
    ws.current.send(JSON.stringify({action: 'sendMessage', text: messageText, email}))
    setMessageText('')
  }

  const onEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey == false) {
      e.preventDefault()
      formRef.current!.requestSubmit()
    }
  }
  
  return <form ref={el => formRef.current = el} onSubmit={handleSubmit}>
    <textarea onChange={(e) => setMessageText(e.target.value)} value={messageText} onKeyDown={onEnterPress}/>
    <button>Send</button>
  </form>
}