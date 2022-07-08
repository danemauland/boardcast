import React, { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import useConfig from "./useConfig"
import $ from "jquery"

export default function ({ email }: { email: string }) {
  const [timestamp, setTimestamp] = useState('')
  const [name, setName] = useState('');
  const navigate = useNavigate()
  const config = useConfig()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const resp = await $.ajax(`${config.app.URL}/usermeeting/${encodeURIComponent(email)}`, {
      method: "POST",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify({name, timestamp})
    })

    console.log({resp})

    navigate(`/${ config.app.STAGE }/meeting/${resp}`)
  }

  return <form onSubmit={handleSubmit}>
    <input onChange={(e) => setName(e.target.value)} value={name} />
    <input type="datetime-local" onChange={(e) => setTimestamp(e.target.value)} value={timestamp} />
    <button>Send</button>
  </form>
}