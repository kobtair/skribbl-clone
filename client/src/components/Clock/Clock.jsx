import clock from '../../assets/clock.png'
import './clock.scss'

export default function Clock() {
  return (
    <div className='clock'>
            <img style={{maxHeight: "100%"}} src={clock} alt="clock" />
            <span>60</span>
            </div>
  )
}
