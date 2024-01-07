import "./modal.styles.scss";
import loading from "../../assets/loading.gif";
import { useContext } from "react";
import { GameContext } from "../../contexts/GameContext";

export default function Modal() {
  const { isChoosing, wordsToChooseFrom, socket } = useContext(GameContext);
  const sendChoice = (e)=>{
    socket.emit("send_choice", e.target.value);
  }
  return (
    <div className="modal-container">
      {!isChoosing ? (
        <div className="waiting">
          <div>Waiting for other players to join</div>
          <img src={loading} alt="loading" />
        </div>
      ) : (
        <div className="choose-words">
          Choose One of the 3 Words{" "}
          <div className="choices">
            {wordsToChooseFrom.map((word,i) => (
              <button value={word} onClick={sendChoice} key={i}>{word}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
