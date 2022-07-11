import { AgendaItem } from "../../../types";
import React from "react"

export default function AgendaItemComponent({agendaItem}: {agendaItem: AgendaItem}) {
  return <div>
    <span>{agendaItem.title}</span><span>({agendaItem.timeEstimate} min)</span>
    {agendaItem.attachments.map(attachment => {
      return <a href={attachment.url} key={attachment.s3Key} download={attachment.name}>{attachment.name}</a>
    })}
    <div>{agendaItem.description}</div>
  </div>
}