import "./modal.styles.scss";
import loading from "../../assets/loading.gif";
import { useContext } from "react";
import { GameContext } from "../../contexts/GameContext";

export default function Modal() {
  const {
    isChoosing,
    setIsChoosing,
    setIsAllowedToDraw,
    setCorrectWord,
    wordsToChooseFrom,
    socket,
    playersList,
    isTurnOver,
    isGameOver,
    isLoading,
  } = useContext(GameContext);
  const sendChoice = (e) => {
    setIsChoosing(false);
    setIsAllowedToDraw(true);
    setCorrectWord(e.target.value);
    socket.emit("send_choice", e.target.value);
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
          {playersList.sort((a,b)=> a.score - b.score).map((player) => (
            <div>
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
          {`${playersList.sort((p1,p2)=>p1.score - p2.score)[0].username} has won`} <br />
          {playersList.sort((p1,p2)=>p1.score - p2.score).map((player) => (
            <div>
              {player.username} {player.score}
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
      {isGameOver ? (
        <div className="waiting">
        <img src={loading} alt="loading" />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
