import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import { UserMeeting } from '@svc/lib/types';
import UserMeetings from './UserMeetings';
import NewUserMeeting from './NewUserMeeting';
import useConfig from '../context/useConfig';
import useAccount from '../context/useAccount';

const fetchMeetings = async (url: string, getSession: Function) => {
  const getUserMeetingsURL = `${url}/api/usermeetings/`;

  const { headers } = (await getSession())!;

  const resp = await $.ajax(getUserMeetingsURL, {
    method: 'GET',
    contentType: 'application/json; charset=utf-8',
    headers,
  });

  const meetings = JSON.parse(resp);
  return meetings;
};

export default function Dashboard() {
  const config = useConfig();
  const [meetings, setMeetings] = useState([]);
  const { getSession } = useAccount();

  useEffect(() => {
    fetchMeetings(config.app.URL, getSession).then(setMeetings);
  }, [config.app.URL, getSession]);

  return (
    <div id="usermeetings-wrapper">
      <NewUserMeeting />
      <UserMeetings meetings={meetings.sort((a: UserMeeting, b: UserMeeting) => {
        if (a.timestamp < b.timestamp) {
          return 1;
        } if (a.timestamp > b.timestamp) {
          return -1;
        }
        return 0;
      })}
      />
    </div>
  );
}
