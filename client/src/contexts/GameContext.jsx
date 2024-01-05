import { createContext, useState } from "react";

import { io } from "socket.io-client";

const socket = io.connect("http://localhost:3001");

export const GameContext = createContext({
  username: "",
  setUsername: () => {},
  messagesArray: [],
  setmessageesArray: () => {},
  sendMessage: () => {},
  socket: null,
  avatar: {},
  setAvatar: () => {},
  isLoggedIn: false,
  setIsLoggedIn: () => {},
});

export const GameContextProvider = ({ children }) => {
  const [username, setUsername] = useState("");
  const [messagesArray, setMessagesArray] = useState([]);
  const [avatar, setAvatar] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const sendMessage = (message) => {
    setMessagesArray([...messagesArray, {username, message}]);
    socket.emit("send_message", { username, message });
  };
  const value = {
    username,
    setUsername,
    sendMessage,
    messagesArray,
    setMessagesArray,
    socket,
    avatar,
    setAvatar,
    isLoggedIn,
    setIsLoggedIn,
  };
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
