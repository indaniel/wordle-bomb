import "./WordleKeyboard.css"
import {FiDelete, FiCheck} from "react-icons/fi"

import { useMemo, useCallback } from "react"

const keys = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  [["enter", <FiCheck/>],"Z","X","V","B","N","M",["delete", <FiDelete/>]]
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
                keyState[key[0]]
              }`} key={idx} onClick={() => {onKey(key[0])}}>
                {key[1] || key[0]}
              </div>
            ))
          }
        </div>
      ))
    }
  </div>
}

export default WordleKeyboard 