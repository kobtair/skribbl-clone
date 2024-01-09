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
  const updatePlayersState = () => {
    io.sockets.emit("update_players_state", game.playersList);
  };
  const endTurn = () => {
    const guessedUsers = game.getGuessedUsers();
    clearInterval(timer);
    game.resetPlayerState();
    game.resetTimer();
    io.sockets.emit("turn_over", guessedUsers);
    timer = setTimeout(startNextTurn, 3000)
  };
  const startNextTurn = ()=> {
    io.sockets.emit("results_done")
    game.chooseNextPlayer();
    updatePlayersState();
  }
  const startTimer = () => {
    timer = setInterval(() => {
      io.sockets.emit("time", game.time);
      if (game.time === 0) {
        endTurn();
      }
      game.time--;
    }, 1000);
  };

  console.log(`a new user has connected: ${socket.id}`);
  socket.on("send_message", (data) => {
    if (data.message.toLowerCase() === game.currentWord.toLowerCase()) {
      const guessedUser = game.playersList.find(
        (player) => player.id === socket.id
      );
      guessedUser.hasGuessed = true;
      io.sockets.emit("receive_message", {
        username: "server",
        message: `${guessedUser.username} has guessed the word`,
        color: "green",
      });
      updatePlayersState();
      if (game.hasEveryoneGuessed()) {
        endTurn();
      }
    } else {
      socket.broadcast.emit("receive_message", data);
    }
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
    const { username, avatar } = data;
    const newPlayer = new Player(socket.id, username, avatar);
    game.addPlayer(newPlayer);
    socket.emit("game_joined", game.playersList);
    io.sockets.emit("receive_message", {
      username: "server",
      message: `${data.username} has joined the game`,
      color: "#2bab2b",
    });
  });
  socket.on("game_joined", () => {
    socket.broadcast.emit("new_player", game.playersList);
    if (!game.isStarted && game.playersList.length >= 2) {
      game.startGame();
      startNextTurn();
    }
  });
  socket.on("give_words", () => {
    const threeWords = game.chooseThreeWords();
    socket.emit("receive_words", threeWords);
  });
  socket.on("send_choice", (choice) => {
    const drawer = game.playersList.find((player) => player.id === socket.id);
    drawer.isDrawing = true;
    drawer.isChoosing = false;
    game.drawer = drawer.username;
    game.currentWord = choice;
    updatePlayersState();
    io.sockets.emit("start_turn", {
      time: game.time,
      wordLength: choice.length,
      round: game.currentRound,
    });
    startTimer();
  });
  socket.on("disconnect", () => {
    console.log(`a user has disconnected: ${socket.id}`);
    const disconnectedPlayer = game.playersList.find(
      (player) => player.id === socket.id
    ).username;
    if (disconnectedPlayer) {
      socket.broadcast.emit("receive_message", {
        username: "server",
        message: `${disconnectedPlayer} has left the game`,
        color: "red",
      });
    }
    game.removePlayer(socket.id);
    socket.broadcast.emit("remove_player", game.playersList);
    if (game.playersList.length < 2) {
      game.reset();
    }
  });
});

server.listen(3001, "0.0.0.0", () => {
  console.log(`Listening at port ${process.env.PORT || "3001"}`);
});
