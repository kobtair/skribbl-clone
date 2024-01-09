import { useContext } from 'react'
import clock from '../../assets/clock.png'
import './clock.scss'
import { GameContext } from '../../contexts/GameContext';


export default function Clock() {
  const {time} = useContext(GameContext);
  return (
    <div className='clock'>
            <img style={{maxHeight: "100%"}} src={clock} alt="clock" />
            <span>{time}</span>
            </div>
  )
}
