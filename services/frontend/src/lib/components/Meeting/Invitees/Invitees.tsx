import React, { useState } from "react"
import { Meeting } from "../../../types"
import Invite from "./Invite"

export default function Invitees({meeting}: {meeting: Meeting}) {
  const [emails, setEmails] = useState(Object.values(meeting.meetingDetails.accessTokens))
  
  const addInvitee = (email: string) => {
    setEmails([...emails, email])
  }

  return <div id="invitees">
    <h2>Invited</h2>
    {emails.map((email) => {
      return <div key={email}>{email}</div>
    })}
    <Invite meeting={meeting} addInvitee={addInvitee} key={emails.length}/>
  </div>
}