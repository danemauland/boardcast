import React, { useContext, useEffect, useState } from 'react';
import $ from 'jquery';

import useConfig from './useConfig';
import UserMeetings from './UserMeetings';
import NewUserMeeting from './NewUserMeeting';
import { AccountContext } from './Account';

export default function Dashboard({email}: {email: string}) {
  const config = useConfig();
  const [meetings, setMeetings] = useState([]);
  
  const fetchMeetings = async (email: string) => {
    const getUserMeetingsURL = `${config.app.URL}/usermeetings/${encodeURIComponent(email)}`
    
    const resp = await $.ajax(getUserMeetingsURL, {
      method: 'GET',
      contentType: 'application/json; charset=utf-8',
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