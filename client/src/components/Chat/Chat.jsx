import { useContext, useState } from "react";
import "./chat.styles.scss";
import { GameContext } from "../../contexts/GameContext";

export default function Chat() {
  const { messagesArray, sendMessage } = useContext(GameContext);
  const [message, setMessage] = useState("");
  return (
    <div className="chat">
      <div className="chat-body">
        {messagesArray.map(({username, message}, i) => (
          <div className={`${i%2!==0 && "message-odd"} `}><span className="username">{`${username}: `}</span><span>{message}</span></div>
        ))}
      </div>
      <form
        className="chat-footer"
        onSubmit={(e) => {
          e.preventDefault();
          e.target.reset();
          sendMessage(message);
        }}
      >
        <label >Guess:</label>
        <input  onChange={(e) => setMessage(e.target.value)} type="text" />
        <button className="send-button" type="submit">Send</button>
      </form>
    </div>
  );
}
