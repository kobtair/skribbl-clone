import Clock from "../Clock/Clock";
import './word.scss'

export default function Word() {
  return (
    <div className="word-component">
        <Clock />
      <div className="word">Guess this</div>
    </div>
  );
}
