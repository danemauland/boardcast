import React, { useEffect, useState } from 'react';

const phrases = ['investor pitches.', 'board meetings.', 'any presentation.'];

function typeLetter(wordIndex: number, letterIndex: number, setDynamicText: Function): any {
  const word = phrases[wordIndex];
  if (letterIndex > word.length) {
    return setTimeout(() => {
      setDynamicText('');
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      removeLetter(wordIndex, word.length, setDynamicText);
    }, 1000);
  }

  setDynamicText(word.slice(0, letterIndex));
  return setTimeout(() => typeLetter(wordIndex, letterIndex + 1, setDynamicText), 100);
}

function removeLetter(wordIndex: number, letterIndex: number, setDynamicText: Function): any {
  const word = phrases[wordIndex];
  if (letterIndex === -1) {
    return setTimeout(() => {
      typeLetter((wordIndex + 1) % 3, 0, setDynamicText);
    }, 100);
  }

  setDynamicText(word.slice(0, letterIndex));
  return setTimeout(() => removeLetter(wordIndex, letterIndex - 1, setDynamicText), 50);
}

export default function Header() {
  const [dynamicText, setDynamicText] = useState('');

  useEffect(() => {
    typeLetter(0, 0, setDynamicText);
  }, []);

  return (
    <div id="header-wrapper">
      <h2>Modern</h2>
      <br />
      <h2>Meetings for</h2>
      <br />
      <h2>
        <span>
          {dynamicText}
          &nbsp;
        </span>
      </h2>
    </div>
  );
}
