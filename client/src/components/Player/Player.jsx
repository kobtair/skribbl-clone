import { useContext } from 'react';
import './player.styles.scss'
import { GameContext } from '../../contexts/GameContext';

export default function Player({player, order}) {
  const {username} = useContext(GameContext)
  const {avatar, score, isChoosing, isDrawing, hasGuessed} = player
  const {top, eye, mouth, clothe} = avatar;
  return (
    <div  className={`player-container ${order%2===0 && "player-odd"} ${(hasGuessed && !isDrawing && !isChoosing )? "player-guessed" : ""}`}>
      <div className="rank">{`${order+1}`}</div>
      <div className="player-name ">
        <div>
        {`${player.username} `}
          {username === player.username ? "(you)" : "" }
        {isChoosing ? " 🤔 ": ""}
        {isDrawing?" 🖊 " : ""}
        </div>
        <div>{score} points</div>
        </div>
      <div className="avatar"><img src={`https://avataaars.io/?topType=${top}&clotheType=${clothe}&clotheColor=Black&eyeType=${eye}&mouthType=${mouth}`} alt="avatar" /></div>
    </div>
  )
}
