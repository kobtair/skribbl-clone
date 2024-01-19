import "./modal.styles.scss";
import loading from "../../assets/loading.gif";
import { useContext, useEffect, useState } from "react";
import { GameContext } from "../../contexts/GameContext";

export default function Modal() {
  const {
    isChoosing,
    setIsChoosing,
    setIsAllowedToDraw,
    setCorrectWord,
    wordsToChooseFrom,
    socket,
    correctWord,
    playersList,
    isTurnOver,
    isGameOver,
  } = useContext(GameContext);
  const [sortedPlayers, setSortedPlayers] = useState([]);
  useEffect(()=>{
    setSortedPlayers(playersList.sort((a,b)=> b.score - a.score))
  }, [playersList])
  const sendChoice = (e) => {
    setIsChoosing(false);
    setIsAllowedToDraw(true);
    setCorrectWord(e.target.value);
    socket.emit("send_choice", {choice: e.target.value, screenWidth: window.innerWidth, screenHeight: window.innerHeight});
  };

  return (
    <div className="modal-container">
      {isChoosing ? (
        <div className="choose-words">
          Choose One of the 3 Words{" "}
          <div className="choices">
            {wordsToChooseFrom.map((word, i) => (
              <button value={word} onClick={sendChoice} key={i}>
                {word}
              </button>
            ))}
          </div>
        </div>
      ) : (
        ""
      )}
      {playersList.length < 2 ? (
        <div className="waiting">
          <div>Waiting for other players to join</div>
          <img src={loading} alt="loading" />
        </div>
      ) : (
        ""
      )}
      {isTurnOver ? (
        <div>
          The correct word was "{correctWord}"
          {sortedPlayers.map((player) => (
            <div key={player.id}>
              {player.username} {player.score}
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
      {isGameOver ? (
        <div>
          Game has Ended <br />
          {`${playersList.sort((a,b)=> b.score - a.score)[0].username} has won`} <br />
          {playersList.sort((p1,p2)=>p2.score - p1.score).map((player) => (
            <div key={player.id}>
              {player.username} {player.score}
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
