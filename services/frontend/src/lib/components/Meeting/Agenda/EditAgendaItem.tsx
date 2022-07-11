import { AgendaItem, Upload } from "../../../types";
import React, { useState } from "react"
import useConfig from "../../context/useConfig"
import $ from "jquery"
import { useParams } from "react-router-dom";
import useAccount from "../../context/useAccount";

export default function EditAgendaItem({agendaItem, orderNum, updateAgendaItem, upload}: {agendaItem: AgendaItem | null, orderNum: number, updateAgendaItem: (arg0: AgendaItem) => any, upload: Upload}) {
  const [title, setTitle] = useState(agendaItem?.title || '')
  const [timeEstimate, setTimeEstimate] = useState(agendaItem?.timeEstimate || 0)
  const [description, setDescription] = useState(agendaItem?.description || '')
  const config = useConfig()
  const { meetingID } = useParams()
  const [file, setFile] = useState<null | File>(null)
  const { getSession } = useAccount()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileObj = event.target.files && event.target.files[0]
    if (!fileObj) return;

    setFile(fileObj)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement> ) => {
    e.preventDefault()
    const updateAgendaItemURL = `${config.app.URL}/api/agendaitem`
    const attachments = agendaItem?.attachments || []

    if (file) {
      attachments.push({name: file.name, s3Key: upload.s3Key})

      const reader = new FileReader()

      const xhr = new XMLHttpRequest()

      xhr.open("PUT", upload.url)

      reader.onload = function(e) {
        xhr.send(e.target?.result)
      }

      reader.readAsArrayBuffer(file)
    }

    const { headers } = (await getSession())!

    
    const resp = await $.ajax(updateAgendaItemURL, {
      method: 'POST',
      contentType: 'application/json; charset=utf-8',
      headers,
      data: JSON.stringify({...agendaItem, title, timeEstimate, description, orderNum, meetingID, attachments} as AgendaItem)
    });

    const newAgendaItem = JSON.parse(resp);
    console.log({ newAgendaItem });
    updateAgendaItem(newAgendaItem);
  }

  return <form onSubmit={handleSubmit}>
    <input type="text" placeholder="Agenda Item Title" value={title} onChange={e => setTitle(e.target.value)}/>
    <span>(</span><input type="number" placeholder="minutes" value={timeEstimate} onChange={e => setTimeEstimate(Number(e.target.value))}/><span>min)</span>
    <input type="file" onChange={handleFileChange}/>
    <textarea placeholder="description" cols={30} rows={10} value={description} onChange={e => setDescription(e.target.value)}></textarea>
    <button>save</button>
  </form>
}