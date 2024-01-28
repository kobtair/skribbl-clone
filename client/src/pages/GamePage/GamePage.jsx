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
    setWordToGuess,
    setIsTurnOver,
    isTurnOver,
    isGameOver,
    setIsGameOver,
    reset,
    setIsAllowedToDraw,
    setCorrectWord,
  } = useContext(GameContext);
  const { startDrawing, draw, finishDrawing, setIsDrawing, clearCanvas, resizeCanvas   } =
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
    socket.on("client_start_drawing", ({ offsetX, offsetY, color, size }) => {
      setIsDrawing(true);
      startDrawing(offsetX, offsetY, color, size);
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
      const {time, wordToGuess, round, drawerWidth, drawerHeight}= data;
      setTime(time);
      setWordToGuess(wordToGuess);
      setRound(round);
      resizeCanvas(drawerWidth, drawerHeight);
    })
    socket.on("hint", wordToGuess=>{
      setWordToGuess(wordToGuess);
    })
    socket.on("clear_canvas", ()=>{
      clearCanvas();
    })
    socket.on("results_done",()=>{
      setIsTurnOver(false);
      setCorrectWord("")
      setIsGameOver(false);
      setIsAllowedToDraw(false);
    })
    socket.on("time", (time)=>{
      setTime(time);
    })
    socket.on("turn_over", (word)=>{
      setIsTurnOver(true);
      setIsAllowedToDraw(false);
      setCorrectWord(word)
    })
    socket.on("disconnect",()=>{
      reset();
      // alert("lost connection to server");
    })
    socket.on("game_over", ()=>{
      setIsGameOver(true);
    })
    socket.on("game_started", ({ nextPlayer, chosenWords }) => {
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
