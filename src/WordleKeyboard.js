import "./WordleKeyboard.css"

import { useMemo, useCallback } from "react"

const keys = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["✔️","Z","X","V","B","N","M","❌"]
]

const defaultKeyState = {
  "Y": "yellow",
  "G": "green",
  "B": "black",
}

const WordleKeyboard = ({keyState = defaultKeyState, onKey = () => {}}) => {
  return <div className="flex-vertical flex-space full-height">
    {
      keys.map((row, idx) => (
        <div className="flex-horizontal flex-space flex-grow" key={idx}>
          {
            row.map((key, idx) => (
              <div className={`wordle-key flex-grow flex-center ${
                keyState[key]
              }`} key={idx} onClick={() => {onKey(key)}}>
                {key}
              </div>
            ))
          }
        </div>
      ))
    }
  </div>
}

export default WordleKeyboard 