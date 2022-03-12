import "./Players.css"

import {GiPodium} from "react-icons/gi"
import {FaHeart} from "react-icons/fa"

const Player = ({name, data={}, isme=false}) => {
  return <div className={`player-data player ${isme && "player-data-me"}`}>
    <div className="player-name">{name}</div>
    <div className="player-data"><FaHeart/> {data.lives} <GiPodium/> {data.score} / {data.highscore}</div>
  </div>
}

const Players = ({me="", queue=[], players={}}) => {
  return <div className={`flex-vertical ${me === queue[0] && "players-active"}`}>
    <div className="flex-horizontal lex-center">
      <Player name={me} data={players[me]} isme={true}/>
    </div>
    <div className="players-list flex-horizontal players-list" style={{
      justifyContent: "flex-start"
    }}>
      <span style={{paddingRight: '1rem'}}>Queue:</span>
      {queue.map((x, idx) => (<Player name={x} data={players[x]}/>))}
    </div>
    {/* <div>You are player {me}</div>
    <div>Lives: {} Score: {} High Score: {}</div>
    <div className="players-list">
      <span>Next turns: </span>
      {queue.map((x, idx) => (<span key={idx} className="player">{x}</span>))}
    </div> */}
  </div>
}

export default Players 