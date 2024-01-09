import { useContext } from "react";
import Clock from "../Clock/Clock";
import './word.scss'
import { GameContext } from "../../contexts/GameContext";

export default function Word() {
  const {round, wordToGuessLength} = useContext(GameContext);
  return (
    <div className="word-component">
      <div className="clock">
        <Clock />
        Round {round} of 3
      </div>
      <div className="word">
        <div>Guess This</div>
        <div className="word-to-guess">{[...Array(wordToGuessLength)].map(letter=><span style={{fontSize: "30px"}}> _ </span>)}</div>
      </div>
    </div>
  );
}
