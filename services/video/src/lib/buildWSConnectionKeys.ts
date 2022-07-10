export const buildWSConnectionPK = (meetingID: string) => `meeting#${meetingID}`;

export const buildWSConnectionSK = (wsConnectionID: string) => `wsConnection#${wsConnectionID}`;

export const buildWSConnectionKeys = ({ wsConnectionID, meetingID }: { wsConnectionID: string, meetingID: string }) => {
  return {
    pk: buildWSConnectionPK(meetingID),
    sk: buildWSConnectionSK(wsConnectionID),
  };
};

export const buildUniquenessWSConnectionKeys = ({ wsConnectionID }: { wsConnectionID: string }) => {
  return {
    pk: `uniq#wsConnectionID#${wsConnectionID}`,
    sk: 'uniq',
  };
};