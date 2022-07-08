import React from "react"
import { Link } from "react-router-dom"

export default function ({ uuid, timestamp, name }: { uuid: string, name: string, timestamp: string }) {
  return <div>
    <Link to={`/meeting/${uuid}`}>{name}</Link>
    <span>{new Date(timestamp).toLocaleString()}</span>
  </div>
}