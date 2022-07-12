import { AgendaItem, Meeting, Upload } from "../../../types"
import React, { useEffect, useRef, useState } from 'react';
import AgendaItemWrapper from "./AgendaItemWrapper";
import EditAgendaItem from "./EditAgendaItem";

export default function Agenda({meeting, isOwner, upload}: {meeting: Meeting, isOwner: boolean, upload: Upload | null}) {
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([])

  useEffect(() => {
    setAgendaItems(meeting.agendaItems)
  }, [])

  const updateAgendaItem = (agendaItem: AgendaItem) => {
    const newAgendaItems = [...agendaItems]
    newAgendaItems[agendaItem.orderNum] = agendaItem
    setAgendaItems(newAgendaItems)
  }

  const removeAgendaItem = (agendaItem: AgendaItem) => {
    let matchIndex: number;
    const dupedAgendaItems = [...agendaItems]
    console.log({deleting: agendaItem})
    dupedAgendaItems.forEach((item, i) => {
      if (item.agendaID === agendaItem.agendaID) matchIndex = i
    })
    console.log(matchIndex!)
    dupedAgendaItems.splice(matchIndex!, 1)
    setAgendaItems(dupedAgendaItems)
  }

  console.log({agendaItems})

  return <div id="agenda-items">
    <h2>{meeting.meetingDetails.name}</h2>
    {agendaItems
      .map(agendaItem => {
        return <AgendaItemWrapper agendaItem={agendaItem} isOwner={isOwner} updateAgendaItem={updateAgendaItem} upload={upload} key={agendaItem.orderNum} removeAgendaItem={removeAgendaItem}/>
      })}
    { isOwner ?
        <EditAgendaItem orderNum={agendaItems.length} updateAgendaItem={updateAgendaItem} agendaItem={null} upload={upload!} key={agendaItems.length}/>
      :
        <></>
    }
  </div>
}