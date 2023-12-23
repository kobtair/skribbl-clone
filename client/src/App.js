import './App.scss';
import GamePage from './pages/GamePage/GamePage';
import background from './assets/background.jpeg'

function App() {
  return (
    <div style={{backgroundImage: `url(${background})` }} className='container'>
      <GamePage />
    </div>
  );
}

export default App;
