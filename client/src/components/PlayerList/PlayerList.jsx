import './player-list.styles.scss'
import Player from '../Player/Player'
import { GameContext } from '../../contexts/GameContext';
import { useContext } from 'react';

export default function PlayerRank() {
  const {playersList} = useContext(GameContext);
  return (
    <div className='player-list'>
       {playersList.map((player, i)=><Player key={player.id} order={i} player={player} />)} 
    </div>
  )
}
