import { AgendaItem, Meeting, Upload } from "../../../types"
import React, { useEffect, useRef, useState } from 'react';
import AgendaItemWrapper from "./AgendaItemWrapper";
import EditAgendaItem from "./EditAgendaItem";

export default function Agenda({meeting, isOwner, upload}: {meeting: Meeting, isOwner: boolean, upload: Upload | null}) {
  const [agendaItems, setAgendaItems] = useState(meeting.agendaItems)

  const updateAgendaItem = (agendaItem: AgendaItem) => {
    const newAgendaItems = [...agendaItems]
    newAgendaItems[agendaItem.orderNum] = agendaItem
    setAgendaItems(newAgendaItems)
  }

  console.log({agendaItems})
  return <>
    {agendaItems
      .map(agendaItem => {
        return <AgendaItemWrapper agendaItem={agendaItem} isOwner={isOwner} updateAgendaItem={updateAgendaItem} upload={upload} key={agendaItem.orderNum}/>
      })}
    { isOwner ?
        <EditAgendaItem orderNum={agendaItems.length} updateAgendaItem={updateAgendaItem} agendaItem={null} upload={upload!}/>
      :
        <></>
    }
  </>
}