import React from 'react';
import { Link } from 'react-router-dom';
import useConfig from '../context/useConfig';

export default function ({ meetingID, timestamp, name }: { meetingID: string, name: string, timestamp: string }) {
  const config = useConfig();
  const stage = config.app.STAGE
  const url = `/${stage}/meeting/${meetingID}`

  return <div className='userMeeting'>
    <Link to={url}>{name}</Link>
    <span>{new Date(timestamp).toLocaleString()}</span>
  </div>;
}