import React, { useState } from 'react';
import { AgendaItem, Upload } from '../../../types';
import AgendaItemComponent from './AgendaItemComponent';
import EditAgendaItem from './EditAgendaItem';

export default function AgendaItemWrapper({
  agendaItem, isOwner, updateAgendaItem, upload, removeAgendaItem,
}: {
  agendaItem: AgendaItem,
  isOwner: boolean,
  updateAgendaItem: (arg0: AgendaItem) => any,
  upload: Upload | null,
  removeAgendaItem: (arg0: AgendaItem) => any }) {
  const [isEditting, setIsEditting] = useState(false);

  const saveAgendaItem = (item: AgendaItem) => {
    setIsEditting(false);
    updateAgendaItem(item);
  };

  return (
    <div>
      { isEditting
        ? (
          <EditAgendaItem
            agendaItem={agendaItem}
            orderNum={agendaItem.orderNum}
            updateAgendaItem={saveAgendaItem}
            upload={upload!}
            removeAgendaItem={removeAgendaItem}
          />
        )
        : (
          <div>
            <AgendaItemComponent agendaItem={agendaItem} />
            {isOwner && <button type="button" className="edit" onClick={((e) => { e.preventDefault(); setIsEditting(true); })}>Edit</button>}
          </div>
        )}
    </div>
  );
}
