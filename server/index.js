const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const Game = require("./config/game");

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
    console.log(data);
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
    const id = socket.id;
    game.addPlayer({id, ...data});
    socket.emit("game_joined", game.playersList);
    socket.broadcast.emit("update_players", game.playersList);
  });
  socket.on("get_users", ()=>{
    socket.emit("receive_users", game.playersList);
  })
  socket.on("disconnect", () => {
    console.log(`a user has disconnected: ${socket.id}`);
    game.removePlayer(socket.id);
    socket.broadcast.emit("update_players",game.playersList);
  });
});

server.listen(3001, () => {
  console.log(`Listening at port ${process.env.PORT || "3001"}`);
});
