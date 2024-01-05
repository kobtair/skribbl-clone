import './player-list.styles.scss'
import Player from '../Player/Player'

export default function PlayerRank() {
  return (
    <div className='player-list'>
       {[...(new Array(7))].map((_,i)=><Player rank={i} key={i} />)} 
    </div>
  )
}
