import React, { useEffect, useState } from 'react';
import { AgendaItem, Meeting, Upload } from '../../../types';
import AgendaItemWrapper from './AgendaItemWrapper';
import EditAgendaItem from './EditAgendaItem';

export default function Agenda({
  meeting,
  isOwner,
  upload,
}: {
  meeting: Meeting,
  isOwner: boolean,
  upload: Upload | null
}) {
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);

  useEffect(() => {
    setAgendaItems(meeting.agendaItems);
  }, [meeting.agendaItems]);

  const updateAgendaItem = (agendaItem: AgendaItem) => {
    const newAgendaItems = [...agendaItems];
    newAgendaItems[agendaItem.orderNum] = agendaItem;
    setAgendaItems(newAgendaItems);
  };

  const removeAgendaItem = (agendaItem: AgendaItem) => {
    let matchIndex: number;
    const dupedAgendaItems = [...agendaItems];
    dupedAgendaItems.forEach((item, i) => {
      if (item.agendaID === agendaItem.agendaID) matchIndex = i;
    });
    dupedAgendaItems.splice(matchIndex!, 1);
    setAgendaItems(dupedAgendaItems);
  };

  const agendaItemProps = {
    isOwner,
    updateAgendaItem,
    upload: upload!,
  };

  return (
    <div id="agenda-items">
      <h2>{meeting.meetingDetails.name}</h2>
      {agendaItems
        .map((agendaItem) => (
          <AgendaItemWrapper
            {...agendaItemProps}
            agendaItem={agendaItem}
            key={agendaItem.orderNum}
            removeAgendaItem={removeAgendaItem}
          />
        ))}

      { isOwner
        && (
        <EditAgendaItem
          {...agendaItemProps}
          orderNum={agendaItems.length}
          agendaItem={null}
          key={agendaItems.length}
        />
        )}
    </div>
  );
}
