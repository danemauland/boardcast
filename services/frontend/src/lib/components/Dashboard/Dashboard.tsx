import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import UserMeetings from './UserMeetings';
import NewUserMeeting from './NewUserMeeting';
import useConfig from '../context/useConfig';
import useAccount from '../context/useAccount';
import { UserMeeting } from '@svc/lib/types';

export default function Dashboard() {
  const config = useConfig();
  const [meetings, setMeetings] = useState([]);
  const { getSession } = useAccount()
  
  const fetchMeetings = async () => {
    const getUserMeetingsURL = `${config.app.URL}/api/usermeetings/`

    const { headers } = (await getSession())!
    
    const resp = await $.ajax(getUserMeetingsURL, {
      method: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers
    });


    const meetings = JSON.parse(resp);
    setMeetings(meetings);
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  return <div id='usermeetings-wrapper'>
    <NewUserMeeting/>
    <UserMeetings meetings={meetings.sort((a: UserMeeting, b: UserMeeting) => a.timestamp < b.timestamp ? 1 : a.timestamp > b.timestamp ? -1 : 0)}/>
  </div>;
}