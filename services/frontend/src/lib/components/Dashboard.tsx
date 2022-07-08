import React, { useEffect, useState } from "react"
import $ from "jquery"

import useConfig from "./useConfig"
import UserMeetings from "./UserMeetings"
import NewUserMeeting from "./NewUserMeeting"

export default function Dashboard({email}: {email: string}) {
  const config = useConfig()
  const [meetings, setMeetings] = useState([])

  const fetchMeetings = async () => {
    
    const resp = await $.ajax(`${config.app.URL}/usermeetings/${email}`, {
      method: "GET",
      contentType: "application/json; charset=utf-8",
    })

    const meetings = JSON.parse(resp)
    console.log({meetings})
    setMeetings(meetings)
  }

  useEffect(() => {
    fetchMeetings()
  }, [])

  return <>
    <NewUserMeeting email={email}/>
    <UserMeetings meetings={meetings}/>
  </>
}