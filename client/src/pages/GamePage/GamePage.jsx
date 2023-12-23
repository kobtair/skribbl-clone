import logo from '../../assets/logo.png'
import Word from "../../components/Word/Word"
import './game-page.styles.scss'

export default function GamePage() {
  return (
    <div className="game-container">
        <div className="logo-container">
            <img style={{maxWidth: '100%', minHeight: '100%'}} src={logo} alt="LOGO" />
        </div>
        <Word />
        <div className='player-container'></div>
        <div className='main-game-components'>
            <div className='player-rank'>rank</div>
            <div className='canvas'> canvas</div>
            <div className="chat">chat</div>
        </div>
    </div>
  )
}
