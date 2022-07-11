import React, { useContext, useEffect, useState } from 'react';
import $ from 'jquery';
import useConfig from './context/useConfig';
import UserMeetings from './UserMeetings';
import NewUserMeeting from './NewUserMeeting';
import useAccount from './context/useAccount';

export default function Dashboard({email}: {email: string}) {
  const config = useConfig();
  const [meetings, setMeetings] = useState([]);
  const { getSession } = useAccount()
  
  const fetchMeetings = async (email: string) => {
    const getUserMeetingsURL = `${config.app.URL}/api/usermeetings/${encodeURIComponent(email)}`

    const { headers } = (await getSession())!
    
    const resp = await $.ajax(getUserMeetingsURL, {
      method: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers
    });

    const meetings = JSON.parse(resp);
    console.log({ meetings });
    setMeetings(meetings);
  };

  useEffect(() => {
    fetchMeetings(email);
  }, []);

  return <>
    <NewUserMeeting email={email}/>
    <UserMeetings meetings={meetings}/>
  </>;
}