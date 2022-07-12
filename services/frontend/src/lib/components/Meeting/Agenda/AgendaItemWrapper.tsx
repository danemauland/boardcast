import { AgendaItem, Upload } from "../../../types";
import AgendaItemComponent from "./AgendaItemComponent"
import React, { useState } from "react"
import EditAgendaItem from "./EditAgendaItem";

export default function AgendaItemWrapper({agendaItem, isOwner, updateAgendaItem, upload, removeAgendaItem}: {agendaItem: AgendaItem, isOwner: boolean, updateAgendaItem: (arg0: AgendaItem) => any, upload: Upload | null, removeAgendaItem: (arg0: AgendaItem) => any}) {
  const [isEditting, setIsEditting] = useState(false)

  const saveAgendaItem = (agendaItem: AgendaItem) => {
    setIsEditting(false)
    updateAgendaItem(agendaItem)
  }
  console.log({agendaItem})
  return <>
    { isEditting ? 
        <EditAgendaItem agendaItem={agendaItem} orderNum={agendaItem.orderNum} updateAgendaItem={saveAgendaItem} upload={upload!} removeAgendaItem={removeAgendaItem}/>
      :
        <>
          <AgendaItemComponent agendaItem={agendaItem}/>
          {isOwner && <a className="edit" onClick={(e => {e.preventDefault(); setIsEditting(true)})}>Edit</a>}
        </>
    }
  </>
}