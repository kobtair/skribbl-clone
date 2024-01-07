const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const Game = require("./config/game");
const Player = require("./config/player");

const game = new Game();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`a new user has connected: ${socket.id}`);
  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_message", data);
  });
  socket.on("start_drawing", (data) => {
    socket.broadcast.emit("client_start_drawing", data);
  });
  socket.on("finish_drawing", () => {
    socket.broadcast.emit("client_finish_drawing");
  });
  socket.on("draw", (data) => {
    socket.broadcast.emit("client_draw", data);
  });
  socket.on("join_game", (data) => {
    const {username, avatar} = data;
    const newPlayer = new Player( socket.id, username, avatar );
    game.addPlayer(newPlayer);
    socket.emit("game_joined", game.playersList);
    io.sockets.emit("receive_message",{username: "server", message:`${data.username} has joined the game`, color: "#2bab2b"});
  });
  socket.on("game_joined", (data)=>{
    socket.broadcast.emit("new_player", game.playersList);
     if(!game.isStarted && game.playersList.length>=2){
      game.startGame();
      game.chooseNextPlayer();
      io.sockets.emit("update_players_state", game.playersList);
     }
    
  })
  socket.on("give_words",()=>{
    const threeWords = game.chooseThreeWords();
    socket.emit("receive_words", threeWords);
  })
  socket.on("send_choice", (choice)=>{
    game.currentWord = choice;
    io.sockets.emit("start_session",{time: game.time, wordLength: choice.length, round: game.currentRound})
  })
  socket.on("disconnect", () => {
    console.log(`a user has disconnected: ${socket.id}`);
    socket.broadcast.emit("receive_message",{username: "server", message:`${game.playersList.find(player=>player.id===socket.id).username} has left the game`, color: "red"});
    game.removePlayer(socket.id);
    socket.broadcast.emit("remove_player",game.playersList);
    if(game.playersList.length<2){
      game.reset();
    }
  });
});

server.listen(3001, '0.0.0.0', () => {
  console.log(`Listening at port ${process.env.PORT || "3001"}`);
});
