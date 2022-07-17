import React, { useState } from 'react';
import $ from 'jquery';
import { Meeting } from '@svc/lib/types';
import useAccount from '../../context/useAccount';
import useConfig from '../../context/useConfig';

export default function Invite(
  { meeting, addInvitee }: { meeting: Meeting, addInvitee: (arg0: string) => any },
) {
  const [email, setEmail] = useState('');
  const { getSession } = useAccount();
  const config = useConfig();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { headers } = (await getSession())!;

    await $.ajax(`${config.app.URL}/api/meeting/${meeting.meetingDetails.meetingID}/invite`, {
      method: 'POST',
      contentType: 'application/json; charset=utf-8',
      data: email,
      headers,
    });

    addInvitee(email);
  };
  return (
    <form onSubmit={handleSubmit}>
      <input id="meeting-invite" type="text" onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">Invite</button>
    </form>
  );
}
