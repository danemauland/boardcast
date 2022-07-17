import React, { useState } from 'react';
import { AiTwotoneFile } from 'react-icons/ai';
import { IoMdArrowDropdownCircle } from 'react-icons/io';
import { AgendaItem } from '../../../types';

export default function AgendaItemComponent({ agendaItem }: { agendaItem: AgendaItem }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hiddenStyle = isExpanded ? { display: 'block', opacity: 1 } : { display: 'none', opacity: 0 };

  return (
    <div className="agendaItem">
      <div>
        <IoMdArrowDropdownCircle color="rgb(15, 114, 125)" className={`dropdown ${isExpanded ? 'expanded' : ''}`} onClick={() => setIsExpanded(!isExpanded)} />
        <span className="agenda-title">
          {agendaItem.title}
          {' '}
        </span>
        <span>
          (
          {agendaItem.timeEstimate}
          {' '}
          min)
        </span>
      </div>
      <div className="hidden-items" style={hiddenStyle}>
        { agendaItem.attachments.map((attachment) => (
          <a href={attachment.url} key={attachment.s3Key} download={attachment.name}>
            <AiTwotoneFile />
            {attachment.name}
          </a>
        ))}
        <div>{agendaItem.description}</div>
      </div>
    </div>
  );
}
