import React, { useState, useRef } from "react"
import useConfig from "./useConfig"

export default function ({ globalUsername, handleUsernameSubmit }: { globalUsername: string, handleUsernameSubmit: Function, userID: number}) {
  if (globalUsername) return <></>
  const config = useConfig()
  
  const formRef: React.MutableRefObject<null | HTMLFormElement> = useRef(null)

  const [newUsername, setNewUsername] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUsername(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    handleUsernameSubmit(newUsername)
  }

  const onEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.shiftKey == false) {
      e.preventDefault()
      formRef.current!.requestSubmit()
    }
  }

  return (
    <div style={{position: 'fixed', height: '100%', width: '100%', backgroundColor: "black", opacity: '50%', zIndex: 1, top: 0, left: 0}}>
      <form ref={el => formRef.current = el} onSubmit={handleSubmit} style={{position: 'relative', top: '25%', left: '25%'}}>
      <label style={{display: 'block'}}>Please enter your name
        <input type="text" value={newUsername} onChange={handleChange} onKeyDown={onEnterPress} style={{display: 'block'}}/>
        <button>Submit</button>
      </label>

      </form>
    </div>
  )
}