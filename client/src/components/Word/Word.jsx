import { useContext } from "react";
import Clock from "../Clock/Clock";
import './word.scss'
import { GameContext } from "../../contexts/GameContext";

export default function Word() {
  const {round, wordToGuess, correctWord} = useContext(GameContext);
  return (
    <div className="word-component">
      <div className="clock">
        <Clock />
        Round {round} of 3
      </div>
      <div className="word">
        <div>Guess This</div>
        <div className="word-to-guess">{correctWord !== ""? <span style={{fontSize: "30px"}}> {correctWord} </span> : wordToGuess.map((letter, i)=><span key={i} style={{fontSize: "30px"}}> {letter} </span>)}</div>
      </div>
    </div>
  );
}
