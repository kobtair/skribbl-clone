import logo from "../../assets/logo.png";
import Word from "../../components/Word/Word";
import PlayerList from "../../components/PlayerList/PlayerList";
import Canvas from "../../components/Canvas/Canvas";
import Palette from "../../components/Palette/Palette";
import Modal from "../../components/Modal/Modal";
import { GameContext } from "../../contexts/GameContext";
import Chat from "../../components/Chat/Chat";
import { useEffect, useContext } from "react";
import "./game-page.styles.scss";
import { CanvasContext } from "../../contexts/CanvasContext";

export default function GamePage() {
  const {
    setMessagesArray,
    messagesArray,
    socket,
    setPlayersList,
    playersList,
    username,
    chooseWords,
    isChoosing,
    setRound,
    setTime,
    setWordToGuessLength,
    setIsTurnOver,
    isTurnOver,
    isGameOver,
    setIsGameOver
  } = useContext(GameContext);
  const { startDrawing, draw, finishDrawing, setIsDrawing, clearCanvas } =
    useContext(CanvasContext);
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessagesArray([...messagesArray, data]);
    });
    socket.on("new_player", (data) => {
      setPlayersList(data);
    });
    socket.on("remove_player", (data) => {
      setPlayersList(data);
    });
    socket.on("update_players_state", (data) => {
      setPlayersList(data);
      if (
        data.find((player) => player.username === username).isChoosing
      ) {
        socket.emit("give_words");
      }
    });
    socket.on("client_start_drawing", ({ offsetX, offsetY }) => {
      setIsDrawing(true);
      startDrawing(offsetX, offsetY);
    });
    socket.on("client_finish_drawing", () => {
      setIsDrawing(false);
      finishDrawing();
    });
    socket.on("client_draw", ({ offsetX, offsetY }) => {
      draw(offsetX, offsetY);
    });
    socket.on("receive_words",(words)=>{
      chooseWords(words);
    })
    socket.on("start_turn",(data)=>{
      const {time, wordLength, round}= data;
      setTime(time);
      setWordToGuessLength(wordLength);
      setRound(round);
    })
    socket.on("clear_canvas", ()=>{
      clearCanvas();
    })
    socket.on("results_done",()=>{
      setIsTurnOver(false);
      setIsGameOver(false);
    })
    socket.on("time", (time)=>{
      setTime(time);
    })
    socket.on("turn_over", ()=>{
      setIsTurnOver(true);
    })
    socket.on("game_over", ()=>{
      setIsGameOver(true);
    })
    socket.on("game_started", ({ nextPlayer, chosenWords }) => {
      console.log("next Player: " + nextPlayer);
      if (nextPlayer === username) {
        chooseWords(chosenWords);
      }
    });
  });
  return (
    <div className="game-container">
      {playersList.length < 2 || isChoosing || isTurnOver || isGameOver? <Modal /> : ""}
      <div className="logo-container">
        <img
          style={{ maxWidth: "100%", minHeight: "100%" }}
          src={logo}
          alt="LOGO"
        />
      </div>
      <Word />
      <div className="player-container"></div>
      <div className="main-game-components">
        <PlayerList />
        <Canvas />
        <Chat />
      </div>
      <Palette />
    </div>
  );
}
