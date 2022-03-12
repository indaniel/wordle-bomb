import './WordleHistory.css'

const WordleRow = ({guess}) => {
  return <div className="flex-horizontal flex-space">
    {guess.map((guess, idx) => (
      <div className={`flex-center flex-grow wordle-char ${guess[1]}`}>
        {guess[0]}
      </div>
    ))}
  </div>
}

const NewRound = () => {
  return <div className="flex-center new-round">
    NEW ROUND
  </div>
}

const WordleHistory = () => {
  return <div className="flex-vertical wordle-history">
    <WordleRow guess={
      [
        ["C", "yellow"],
        ["R", "green"],
        ["A", "black"],
        ["N", "black"],
        ["E", "black"]
      ]
    }/>
    <NewRound/>
  </div>
}

export default WordleHistory 