import './WordleHistory.css'

const WordleRow = ({guess, err}) => {
  return <div className="flex-horizontal flex-space guess-row">
    {guess.map((guess, idx) => (
      <div key={idx} className={`flex-center flex-grow wordle-char ${guess[1]}`} style={{
        animationDelay: `${idx * 0.15}s`
      }}>
        {guess[0].toUpperCase()}
      </div>
    ))}
    {err && <div className="guess-err flex-center">{err}</div>}
  </div>
}

const NewRound = () => {
  return <div className="flex-center new-round">
    NEW ROUND
  </div>
}

const blankGuess = [
  ["", "black"],
  ["", "black"],
  ["", "black"],
  ["", "black"],
  ["", "black"]
]

const defaultHistory = [
  {
    type: "new"
  },
  {
    type: "guess",
    data: [
      ["C", "yellow"],
      ["R", "green"],
      ["A", "black"],
      ["N", "black"],
      ["E", "black"]
    ]
  },
  {
    type: "new"
  }
]

const WordleHistory = ({historyState=defaultHistory, current=[], err=null}) => {
  return <div className="flex-vertical wordle-history full-height" style={{
    justifyContent: 'flex-end',
    maxWidth: 600,
    margin: "0 auto"
  }}>
    {
      historyState.map((event, idx) => {
        switch(event.type) {
          case "guess":
            return <WordleRow key={idx} guess={
              event.data
            }/>
          case "new":
            return <NewRound key={idx}/>
        }
      })
    }
    <WordleRow guess={
      [...current, "", "", "", "", ""].slice(0,5).map((x) => ([x, "black"]))
    } err={err}/>
  </div>
}

export default WordleHistory 