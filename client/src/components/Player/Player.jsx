import { useContext } from "react"
import { GameContext } from "../../contexts/GameContext"
import './player.styles.scss'

export default function Player({rank}) {
  const {username, avatar} = useContext(GameContext)
  const {top, eye, mouth, clothe} = avatar;
  return (
    <div  className={`player-container ${rank%2===0 && "player-odd"}`}>
      <div className="rank">{`#${rank+1}`}</div>
      <div className="player-name">{username}</div>
      <div className="avatar"><img src={`https://avataaars.io/?topType=${top}&clotheType=${clothe}&clotheColor=Black&eyeType=${eye}&mouthType=${mouth}`} alt="avatar" /></div>
    </div>
  )
}
