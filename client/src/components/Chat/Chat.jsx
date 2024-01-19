import { useContext, useState } from "react";
import "./chat.styles.scss";
import { GameContext } from "../../contexts/GameContext";
import ScrollToBottom from "react-scroll-to-bottom"

export default function Chat() {
  const { messagesArray, sendMessage } = useContext(GameContext);
  const [message, setMessage] = useState("");
  return (
    <div className="chat">
      <ScrollToBottom className="chat-body">
        {messagesArray.map(({ username, message, color }, i) => (
          <div className={i%2===0?"message-odd":""} key={i} >
            <span
              className={`username ${username === "server" ? "hidden" : ""}`}
            >{`${username}: `}</span>
            <span style={{ color: color }}>{message}</span>
          </div>
        ))}
      </ScrollToBottom>
      <form
        className="chat-footer"
        onSubmit={(e) => {
          e.preventDefault();
          e.target.reset();
          sendMessage(message);
        }}
      >
        <label>Guess:</label>
        <input onChange={(e) => setMessage(e.target.value)} type="text" />
        <button className="send-button" type="submit">
          Send
        </button>
      </form>
    </div>
  );
}
