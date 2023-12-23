import logo from '../../assets/logo.png'
import Word from "../../components/Word/Word"
import PlayerList from '../../components/PlayerList/PlayerList'
import Canvas from '../../components/Canvas/Canvas'
import Chat from '../../components/Chat/Chat'
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
            <PlayerList />
            <Canvas />
            <Chat />
        </div>
    </div>
  )
}
