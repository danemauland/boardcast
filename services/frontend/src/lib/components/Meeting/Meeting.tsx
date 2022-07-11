import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Meeting, Upload } from '../../types';
import $ from 'jquery'
import Chat from './Chat/Chat';
import useConfig from '../context/useConfig';
import Agenda from "./Agenda/Agenda"
import useAccount from '../context/useAccount';

export default function() {
  const [email, setEmail] = useState<string | null>(null)
  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const config = useConfig();
  const meetingID = useParams().meetingID;
  const [isOwner, setIsOwner] = useState(false)
  const [upload, setUpload] = useState<Upload | null>(null)
  
  const { getSession } = useAccount()
  const { getEmail } = useAccount();


  const { accessToken } = useParams()

  const fetchMeeting = async () => {
    console.log('fetching')

    let fetchMeetingURL = `${config.app.URL}/api/meeting/${meetingID}`
    let headers = undefined;

    if (accessToken) {
      fetchMeetingURL += `/${accessToken}`
    } else {
      headers = (await getSession())!.headers
    }
    
    const resp = await $.ajax(fetchMeetingURL, {
      method: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers
    });

    const meeting = JSON.parse(resp) as Meeting

    console.log({meeting});
    const isOwner = meeting.meetingDetails.ownerEmail === email

    if (isOwner) setIsOwner(isOwner)

    setUpload(meeting.upload);

    // so it isn't accidentally used if it changes when a new URL is received
    meeting.upload = null;

    setMeeting(meeting)
  }

  useEffect(() => {
    if (!email && !accessToken) {
      getEmail().then(setEmail)
    }
    fetchMeeting()
  }, [email])

  useEffect(() => {
    if (meeting && accessToken) {
      setEmail(meeting.meetingDetails.accessTokens[accessToken])
    }
  }, [meeting])

  if (!email || !meeting) return <></>

  return <>
    <Agenda meeting={meeting} isOwner={isOwner} upload={upload}></Agenda>
    <Chat email={email} meeting={meeting}></Chat>;
  </>
}