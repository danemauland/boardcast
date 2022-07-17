import React, { useEffect, useRef } from 'react';
import {
  KinesisVideoClient, CreateSignalingChannelCommand, DescribeSignalingChannelCommand, GetSignalingChannelEndpointCommand,
} from '@aws-sdk/client-kinesis-video';
import { SignalingClient, Role } from 'amazon-kinesis-video-streams-webrtc';
import { KinesisVideoSignalingClient, GetIceServerConfigCommand } from '@aws-sdk/client-kinesis-video-signaling';
import useConfig from '../../context/useConfig';
import { Meeting } from '../../../types';

interface Master {
  signalingClient: null | SignalingClient,
  peerConnectionByClientId: {},
  dataChannelByClientId: {},
  localStream: null,
  remoteStreams: [],
  peerConnectionStatsInterval: null,
}

export default function PresenterVideo({ meeting }: { meeting: Meeting }) {
  // const videoRef: React.MutableRefObject<null | HTMLVideoElement> = useRef(null);
  // const config = useConfig()
  // const email = 'placeholder'

  // const master: Master = {
  //   signalingClient: null,
  //   peerConnectionByClientId: {},
  //   dataChannelByClientId: {},
  //   localStream: null,
  //   remoteStreams: [],
  //   peerConnectionStatsInterval: null,
  // };

  // const ChannelARN = 'arn:aws:kinesisvideo:us-east-1:895651511551:channel/stream0/1657561202757'

  // const setup = async (video: HTMLVideoElement) => {
  //   const kinesisVideoClient = new KinesisVideoClient({region: config.app.REGION, credentialDefaultProvider: () => () => Promise.resolve({accessKeyId: meeting.credentials!.AccessKeyId!, secretAccessKey: meeting.credentials!.AccessKeyId!, sessionToken: meeting.credentials!.SessionToken!})})
  //   const getSignallingChannelEndpointResponse = await kinesisVideoClient.send(new GetSignalingChannelEndpointCommand({
  //     ChannelARN,
  //     SingleMasterChannelEndpointConfiguration: {
  //       Protocols: ['WSS', 'HTTPS'],
  //       Role: Role.VIEWER
  //     }
  //   }))

  // const endpointsByProtocol = getSignallingChannelEndpointResponse.ResourceEndpointList!.reduce((endpoints, endpoint) => {
  //   // @ts-expect-error
  //   endpoints[endpoint.Protocol!] = endpoint.ResourceEndpoint
  //   return endpoints
  // }, {})

  // const kinesisVideoSignalingChannelsClient = new KinesisVideoSignalingClient({region: config.app.REGION});

  // const iceServerConfig = await kinesisVideoSignalingChannelsClient.send(new GetIceServerConfigCommand({
  //   ChannelARN,
  // }))

  // const iceServers: {urls: string | string[], username?: string, credential?: string}[] = [
  //   { urls: `stun:stun.kinesisvideo.${config.app.REGION}.amazonaws.com:443` }
  // ]

  // iceServerConfig.IceServerList!.forEach(iceServer =>
  //   iceServers.push({
  //       urls: iceServer!.Uris!,
  //       username: iceServer.Username,
  //       credential: iceServer.Password,
  //   }),
  // );

  // const peerConnection = new RTCPeerConnection({iceServers})

  // const signalingClient = new SignalingClient({
  //   channelARN: ChannelARN,
  //   // @ts-expect-error
  //   channelEndpoint: endpointsByProtocol.WSS,
  //   clientId: email,
  //   role: Role.VIEWER,
  //   region: config.app.REGION,
  //   credentials: {
  //     accessKeyId: meeting.credentials!.AccessKeyId!,
  //     secretAccessKey: meeting.credentials!.SecretAccessKey!,
  //     sessionToken: meeting.credentials!.SessionToken!
  //   },
  //   systemClockOffset: kinesisVideoClient.config.systemClockOffset
  // })

  // // Once the signaling channel connection is open, connect to the webcam and create an offer to send to the master
  // signalingClient.on('open', async () => {
  //     // Get a stream from the webcam, add it to the peer connection, and display it in the local view
  //     try {
  //         const localStream = await navigator.mediaDevices.getUserMedia({
  //             video: { width: { ideal: 1280 }, height: { ideal: 720 } },
  //             audio: true,
  //         });
  //         localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
  //         video.srcObject = localStream;
  //     } catch (e) {
  //         // Could not find webcam
  //         return;
  //     }

  //     // Create an SDP offer and send it to the master
  //     const offer = await peerConnection.createOffer({
  //         offerToReceiveAudio: true,
  //         offerToReceiveVideo: true,
  //     });
  //     await peerConnection.setLocalDescription(offer);
  //     signalingClient.sendSdpOffer(peerConnection.localDescription!);
  // });

  // // When the SDP answer is received back from the master, add it to the peer connection.
  // signalingClient.on('sdpAnswer', async answer => {
  //     await peerConnection.setRemoteDescription(answer);
  // });

  // // When an ICE candidate is received from the master, add it to the peer connection.
  // signalingClient.on('iceCandidate', candidate => {
  //     peerConnection.addIceCandidate(candidate);
  // });

  // signalingClient.on('close', () => {
  //     // Handle client closures
  // });

  // signalingClient.on('error', error => {
  //     // Handle client errors
  // });

  // // Send any ICE candidates generated by the peer connection to the other peer
  // peerConnection.addEventListener('icecandidate', ({ candidate }) => {
  //     if (candidate) {
  //         signalingClient.sendIceCandidate(candidate);
  //     } else {
  //         // No more ICE candidates will be generated
  //     }
  // });

  // // As remote tracks are received, add them to the remote view
  // peerConnection.addEventListener('track', event => {
  //     if (video.srcObject) {
  //         return;
  //     }
  //     video.srcObject = event.streams[0];
  //   });
  // }

  // useEffect(() => {
  //   if (videoRef.current)
  //   setup(videoRef.current)
  // }, [videoRef.current])

  // return <video autoPlay playsInline controls muted ref={videoRef}/>
  return (
    <div id="presenter-video-wrapper">
      <div id="presenter-video">
        Placeholder while AWS resolves WebRTC bug, see
        <a href="https://github.com/aws/aws-sdk-js-v3/issues/3794"> Kinesis Video Client browser config issue #3794 </a>
      </div>
    </div>
  );
}
