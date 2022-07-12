import React, { useEffect, useState } from "react"
export default function Header() {
  const [dynamicText, setDynamicText] = useState('')

  const phrases = ['investor pitches.', 'board meetings.', 'any presentation.']

  function removeLetter(wordIndex: number, letterIndex: number): any {
    const word = phrases[wordIndex]
    if (letterIndex === -1) {
      return setTimeout(() => {
        typeLetter((wordIndex + 1) % 3, 0)
      }, 100)
    }

    setDynamicText(word.slice(0, letterIndex))
    return setTimeout(() => removeLetter(wordIndex, letterIndex - 1), 50)
  }

  function typeLetter(wordIndex: number, letterIndex: number): any {
    const word = phrases[wordIndex]
    if (letterIndex > word.length) {
      return setTimeout(() => {
        setDynamicText('')
        removeLetter(wordIndex, word.length)
      }, 1000)
    }

    setDynamicText(word.slice(0, letterIndex))
    return setTimeout(() => typeLetter(wordIndex, letterIndex + 1), 100)
  }

  useEffect(() => {
    typeLetter(0, 0)
  }, [])

  return <div id="header-wrapper">
    <h2>Modern</h2>
    <br />
    <h2>Meetings for</h2>
    <br />
    <h2><span>{dynamicText}&nbsp;</span></h2>
  </div>
}