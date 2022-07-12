import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useConfig from '../context/useConfig';
import $ from 'jquery';
import useAccount from '../context/useAccount';

export default function () {
  const [timestamp, setTimestamp] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const config = useConfig();
  const { getSession } = useAccount()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { headers } = (await getSession())!

    const resp = await $.ajax(`${config.app.URL}/api/usermeeting/`, {
      method: 'POST',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({ name, timestamp: new Date(timestamp).toISOString() }),
      headers
    });

    navigate(`/${ config.app.STAGE }/meeting/${resp}`);
  };

  return <form onSubmit={handleSubmit} id='new-meeting'>
    <h2>Schedule your next boardcast</h2>
    <input onChange={(e) => setName(e.target.value)} value={name} placeholder='Boardcast Title' />
    <input type="datetime-local" onChange={(e) => setTimestamp(e.target.value)} value={timestamp} />
    <button>Send</button>
  </form>;
}