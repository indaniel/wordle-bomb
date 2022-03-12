import WordleHistory from "./WordleHistory"
import Players from "./Players"
import ChatBox from "./ChatBox"
import WordleKeyboard from "./WordleKeyboard"
import {io} from 'socket.io-client'
import "./Main.css"

const Main = () => {
  const conn = io('http://localhost:3000',{path:"/api/socket"})
  return <main id="layout">
    <div id="header" className="flex-vertical">WORDLE BOMB</div>
    <div id="wordle-history">
      <WordleHistory/>
    </div>
    <div id="players">
      <Players/>
    </div>
    <div id="chatbox">
      <ChatBox/>
    </div>
    <div id="wordle-keyboard">
      <WordleKeyboard/>
    </div>
  </main>
}

export default Main 