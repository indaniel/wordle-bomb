import WordleHistory from "./WordleHistory"
import Players from "./Players"
import ChatBox from "./ChatBox"
import WordleKeyboard from "./WordleKeyboard"
import {io} from 'socket.io-client'
import {FaBomb} from "react-icons/fa"
import allowedGuesses from "./AllowedGuesses"
import "./Main.css"

import { useState, useMemo, useCallback, useEffect} from "react"

const Main = () => {
  const userId = useMemo(() => Math.round(Math.random() * 1000000000).toString(), [])

  const [socket, setSocket] = useState(null)
  const [gameState, setGameState] = useState(null)
  const [guess, setGuess] = useState([])
  const [err, setErr] = useState(null)

  const onKey = useCallback((key) => {
    console.log(key)
    if (key.length === 1 && guess.length < 5) {
      setGuess([
        ...guess, key
      ])
    } else if (key === "BACKSPACE") {
      setGuess(guess.slice(0, -1))
    } else if (key === "ENTER") {
      console.log("Guessing", guess)
      const guessString = guess.join("").toLowerCase();
      if (guess.length != 5) {
        setErr("Guess is not 5 letters")
        setTimeout(() => {
          setErr(null)
        }, 1000);
        
      } else if (!(guessString in allowedGuesses)) {
        console.log(allowedGuesses)
        // check if real word here
        setErr("Guess is not a word")
        setTimeout(() => {
          setErr(null)
        }, 1000);

        console.log("Guess is not a word!")
      } else {
        console.log("Sending guess!")
        // Send!
        
        socket.emit("guess", {
          user: userId,
          guess: guessString
        })
        
      }
      setGuess([])
    }
  }, [guess, setGuess])

  useEffect(() => {
    if (!!socket) {
      socket.on("connect", () => {
        console.log("joining")
        socket.emit("join", {
          user: userId
        });
      });
  
      socket.on("update", (e) => {
        console.log("update", e)
        setGameState(e)
      })
    } else {
      setSocket(io('http://localhost:3000',{path:"/api/socket"}))
    }
  }, [socket])

  return <main id="layout">
    <div id="header" className="flex-vertical">
      <span>WORDLE B<FaBomb/>MB</span>
    </div>
    <div id="wordle-history">
      <WordleHistory historyState={gameState && gameState.history || []} current={guess} err={err}/>
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