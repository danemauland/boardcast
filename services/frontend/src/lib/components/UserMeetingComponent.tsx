import React from 'react';
import { Link } from 'react-router-dom';
import useConfig from './useConfig';

export default function ({ uuid, timestamp, name }: { uuid: string, name: string, timestamp: string }) {
  const config = useConfig();
  const stage = config.app.STAGE
  const url = `/${stage}/meeting/${uuid}`

  return <div>
    <Link to={url}>{name}</Link>
    <span>{new Date(timestamp).toLocaleString()}</span>
  </div>;
}