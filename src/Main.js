import WordleHistory from "./WordleHistory"
import Players from "./Players"
import ChatBox from "./ChatBox"
import WordleKeyboard from "./WordleKeyboard"
import {io} from 'socket.io-client'
import {FaBomb} from "react-icons/fa"
import "./Main.css"

import { useState, useMemo, useCallback, useEffect} from "react"

const Main = () => {
  const conn = useMemo(() => io('http://localhost:3000',{path:"/api/socket"}), [])
  const userId = useMemo(() => Math.round(Math.random() * 1000000000).toString())

  const [guess, setGuess] = useState([])
  const [err, setErr] = useState(null)

  const onKey = useCallback((key) => {
    console.log(key)
    if (key.length === 1 && guess.length < 5) {
      setGuess([
        ...guess, key
      ])
    } else if (key === "delete") {
      setGuess(guess.slice(0, -1))
    } else if (key === "enter") {
      console.log("Guessing", guess)
      if (guess.length != 5) {
        setErr("Guess a full word!")
      } else if (false) {
        // check if real word here
      } else {
        // Send!
        /*
        io.emit("guess", {
          user: userId,
          guess: guess
        })
        */
      }
      setGuess([])
    }
  }, [guess, setGuess])

  useEffect(() => {
    /*
    io.on("update", () => {})
    */
  }, [])

  return <main id="layout">
    <div id="header" className="flex-vertical">
      <span>WORDLE B<FaBomb/>MB</span>
    </div>
    <div id="wordle-history">
      <WordleHistory current={guess}/>
    </div>
    <div id="players">
      <Players/>
    </div>
    <div id="chatbox">
      <ChatBox/>
    </div>
    <div id="wordle-keyboard">
      <WordleKeyboard onKey={onKey}/>
    </div>
  </main>
}

export default Main 