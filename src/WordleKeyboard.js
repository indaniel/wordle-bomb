import "./WordleKeyboard.css"
import {FiDelete, FiCheck} from "react-icons/fi"
import { useEffect } from "react"

const keys = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  [["ENTER", <FiCheck/>],"Z","X","C","V","B","N","M",["BACKSPACE", <FiDelete/>]]
]

const flatKeys = []

for (let i of keys) {
  for (let j of i) {
    flatKeys.push(j[0])
  }
}

const charset = "qwertyuiopasdfghjklzxcvbnm"

const defaultKeyState = {
  "Y": "yellow",
  "G": "green",
  "B": "black",
}

const WordleKeyboard = ({keyState = defaultKeyState, onKey = () => {}}) => {
  useEffect(() => {
    function downHandler(e) {
      const key = e.key.toUpperCase();
      if (flatKeys.includes(key)) {
        onKey(key)
      }
    }
    window.addEventListener("keydown", downHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
    };
  }, [onKey]);

  return <div className="flex-vertical flex-space full-height" style={{
    maxWidth: 600,
    margin: "0 auto",
  }}>
    {
      keys.map((row, idx) => (
        <div className="flex-horizontal flex-space flex-grow" key={idx}>
          {
            row.map((key, idx) => (
              <div className={`wordle-key flex-grow flex-center ${
                keyState[key[0].toLowerCase()]
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