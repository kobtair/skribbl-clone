import './player.styles.scss'

export default function Player({player, order}) {
  const {username, avatar, score, isChoosing} = player
  const {top, eye, mouth, clothe} = avatar;
  return (
    <div  className={`player-container ${order%2===0 && "player-odd"}`}>
      <div className="rank">{`#1`}</div>
      <div className="player-name">
        <div>
        {username}({isChoosing ? "choosing": ""})
        </div>
        <div>{score} points</div>
        </div>
      <div className="avatar"><img src={`https://avataaars.io/?topType=${top}&clotheType=${clothe}&clotheColor=Black&eyeType=${eye}&mouthType=${mouth}`} alt="avatar" /></div>
    </div>
  )
}
