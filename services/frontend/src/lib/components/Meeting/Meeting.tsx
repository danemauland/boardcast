import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import $ from 'jquery';
import { Meeting, Upload } from '../../types';
import Chat from './Chat/Chat';
import useConfig from '../context/useConfig';
import Agenda from './Agenda/Agenda';
import useAccount from '../context/useAccount';
import Invitees from './Invitees/Invitees';
import PresenterVideo from './Videos/PresenterVideo';

const fetchMeeting = async ({
  url,
  meetingID,
  accessToken,
  getSession,
}: {
  url: string,
  meetingID: string,
  accessToken?: string,
  getSession: Function,
}) => {
  let fetchMeetingURL = `${url}/api/meeting/${meetingID}`;
  let headers;

  if (accessToken) {
    fetchMeetingURL += `/${accessToken}`;
  } else {
    headers = (await getSession())!.headers;
  }

  const resp = await $.ajax(fetchMeetingURL, {
    method: 'GET',
    contentType: 'application/json; charset=utf-8',
    headers,
  });

  return JSON.parse(resp) as Meeting;
};

export default function MeetingComponent() {
  const [email, setEmail] = useState<string | null>(null);
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const config = useConfig();
  const meetingID = useParams().meetingID;
  const [isOwner, setIsOwner] = useState(false);
  const [upload, setUpload] = useState<Upload | null>(null);

  const { getSession } = useAccount();
  const { getEmail } = useAccount();

  const { accessToken } = useParams();

  useEffect(() => {
    if (!email && !accessToken) {
      getEmail().then(setEmail);
      return;
    }

    fetchMeeting({
      url: config.app.URL,
      meetingID: meetingID!,
      accessToken,
      getSession,
    }).then((newMeeting) => {
      const newIsOwner = newMeeting.meetingDetails.ownerEmail === email;

      if (newIsOwner) setIsOwner(newIsOwner);

      setUpload(newMeeting.upload);

      // so it isn't accidentally used if it changes when a new URL is received
      // eslint-disable-next-line no-param-reassign
      newMeeting.upload = null;

      setMeeting(newMeeting);
    });
  }, [email, accessToken, config.app.URL, getEmail, getSession, meetingID]);

  useEffect(() => {
    if (meeting && accessToken) {
      setEmail(meeting.meetingDetails.accessTokens[accessToken]);
    }
  }, [meeting, accessToken]);

  return (email && meeting
    && (
    <div id="meeting-wrapper">
      <div>
        <PresenterVideo meeting={meeting} />
        <Chat email={email} meeting={meeting} />
      </div>
      <div>
        <Agenda meeting={meeting} isOwner={isOwner} upload={upload} />
        { isOwner
      && <Invitees meeting={meeting} />}
      </div>
    </div>
    )
  );
}
