const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const Game = require("./config/game");
const Player = require("./config/player");

const game = new Game();

app.use(cors());
//creating http server.
const server = http.createServer(app);
// change the cors origin to the domain or url of the client.
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

//connecting to sockts.
io.on("connection", (socket) => {
  //function to update the player state on the client side.
  const updatePlayersState = () => {
    io.sockets.emit("update_players_state", game.getPlayers());
  };
  //function to end the turn when which can be when the time runs out or all players guess correct.
  const endTurn = () => {
    //getting users who have guessed correct.
    const guessedUsers = game.getGuessedUsers();
    // reverting back the isHintSent value
    game.isHintSent = false;
    //finding who is currently drawing.
    const drawer = game.getDrawer();
    //rewarding the drawer if more people have guessed correct.
    drawer.score += guessedUsers.length * 10;
    updatePlayersState();
    //making sure that the timer is stopped when turn ends and reseting turn and player state.
    clearInterval(timer);
    game.resetPlayerState();
    game.resetTimer();
    //cheking if all players have had their turn and all rounds have finished.
    if (
      game.getRemainingPlayers().length === 0 && game.checkLastRound()
    ) {
      io.sockets.emit("game_over", game.getPlayers());
      game.reset();
      timer = setTimeout(startNextTurn, 5000);
    }
    // if not then start the next turn after 3 seconds to display scores after the turn.
    else {
      io.sockets.emit("turn_over", guessedUsers);
      timer = setTimeout(startNextTurn, 3000);
    }
  };
  //function to start next turn.
  const startNextTurn = () => {
    //clearing the canvas for all clients.
    io.sockets.emit("clear_canvas");
    //telling the clients to stop showing the results and to prepare for next turn.
    io.sockets.emit("results_done");
    //at the start of new turn choosing a random player who has not had his turn yet and updating the game state with his name.
    game.chooseNextPlayer();
    updatePlayersState();
  };
  //function to start the timer and to update and send it to clients after each second.
  const startTimer = () => {
    timer = setInterval(() => {
      //if players are less than 2 then clear the interval.
      if (game.getPlayers() < 2) {
        clearInterval(timer);
      }
      //sending the time to client after each second i.e, 1000ms.
      io.sockets.emit("time", game.getTime());
      //if the turn hits the half way point send a hint to all players once.
      if (game.getTime() <= game.totalTime / 2 && !game.isHintSent) {
        const hint = game.getHint();
        let wordToGuess = game.getWordToGuess();
        hint.map((h) => (wordToGuess[h.randomIndex] = h.correspondingLetter));
        io.sockets.emit("hint", wordToGuess);
        game.isHintSent = true;
      }
      // end the turn when timer hits 0.
      if (game.getTime() === 0) {
        endTurn();
      }
      //subtract one second from game time after every one second
      game.oneSecondPassed();
    }, 1000);
  };
  // printing the socket id of users joining the game in the console.
  console.log(`a new user has connected: ${socket.id}`);
  //taking message(guess) from client and broadcasting it to all other players.
  socket.on("send_message", (data) => {
    //checking if user has guessed correctly. if yes, sending a message to other players that the user has guessed.
    if (data.message.toLowerCase() === game.currentWord.toLowerCase()) {
      const guessedUser = game.getPlayers().find(
        (player) => player.id === socket.id
      );
      // finding players who have not guessed yet.
      const noGuessPlayers = game.getPlayers().filter(
        (player) => !player.hasGuessed
      );
      // if the player has not guessed before, then giving him points and changing his state.
      if (!guessedUser.hasGuessed) {
        guessedUser.score += noGuessPlayers.length * 10 + 10;
        //telling all other players that the user has guessed correctly.
        io.sockets.emit("receive_message", {
          username: "server",
          message: `${guessedUser.username} has guessed the word`,
          color: "green",
        });
      }
      //updating the player (who has guessed the word)'s state.
      guessedUser.hasGuessed = true;
      // updating player state for all clients.
      updatePlayersState();
      if (game.hasEveryoneGuessed()) {
        endTurn();
      }
    } 
    // if the user has not guessed correctly, then just broadcast the message to other players.
    else {
      socket.broadcast.emit("receive_message", data);
    }
  });
  // telling clients to move to the coordiante where the drawing will start.
  socket.on("start_drawing", (data) => {
    socket.broadcast.emit("client_start_drawing", data);
  });
  // telling clients to move to the coordiante where the drawer is moving his mouse to draw.
  socket.on("draw", (data) => {
    socket.broadcast.emit("client_draw", data);
  });
  // telling the clients that the drawer has finished the stroke.
  socket.on("finish_drawing", () => {
    socket.broadcast.emit("client_finish_drawing");
  });
  //telling all users to clear their canvas when the drawer clears his canvas.
  socket.on("clear_canvas", () => {
    socket.broadcast.emit("clear_canvas");
  });
  //taking player data and storing it in the game object (name and avatar) when he joins.
  socket.on("join_game", (data) => {
    const { username, avatar } = data;
    // creating a new instace of the player object and pushing it into the game object
    const newPlayer = new Player(socket.id, username, avatar);
    game.addPlayer(newPlayer);
    // telling everyone that a new player has joined.
    socket.emit("game_joined", game.getPlayers());
    io.sockets.emit("receive_message", {
      username: "server",
      message: `${data.username} has joined the game`,
      color: "#2bab2b",
    });
  });
  // client telling the server that he has joined the game.
  socket.on("game_joined", () => {
    // telling other players to update their state because new player has joined.
    socket.broadcast.emit("new_player", game.getPlayers());
    // starting the game if the game isn't already started and player count is more than 1.
    if (!game.isStarted && game.getPlayers().length >= 2) {
      game.startGame();
      startNextTurn();
    }
  });
  // chooser (player who is assigned the choosing role by the server) asking the server for words.
  socket.on("give_words", () => {
    //using chooseThreeWords() method from the game object to get three random words from the words list.
    const threeWords = game.chooseThreeWords();
    // giving the words to the chooser.
    socket.emit("receive_words", threeWords);
  });
  // chooser sending back his choice from the three words.
  socket.on("send_choice", (choice) => {
    // assigning drawing role to the chooser and taking back his choosing role.
    const drawer = game.getPlayers().find((player) => player.id === socket.id);
    drawer.isDrawing = true;
    drawer.isChoosing = false;
    game.drawer = drawer.username;
    // updating the current word to the word chosen by the chooser.
    game.currentWord = choice;
    updatePlayersState();
    /* generating an array based on the length of the correct word to display of the client side. 
      Something like this ([ _ , _ , _ , _ , _ , _ ])    
    */
    const wordToGuess = game.getWordToGuess();
    // telling players that the turn has started and sending some state like time, word to guess and current round.
    io.sockets.emit("start_turn", {
      time: game.time,
      wordToGuess,
      round: game.currentRound,
    });
    // starting the timer.
    startTimer();
  });
  // Runs when the a player disconnects from the game.
  socket.on("disconnect", () => {
    // printing out which socket has disconnected.
    console.log(`a user has disconnected: ${socket.id}`);
    // finding the player who has disconnected using their id (which is also the socket id).
    const disconnectedPlayer = game.playersList.find(
      (player) => player.id === socket.id
    ).username;
    // if the disconnected player is in the player list tell everyone else that he has left.
    if (disconnectedPlayer) {
      socket.broadcast.emit("receive_message", {
        username: "server",
        message: `${disconnectedPlayer} has left the game`,
        color: "red",
      });
    }
    //remove the player from the playersList in the game state.
    game.removePlayer(socket.id);
    // tell other players to remove him as well.
    socket.broadcast.emit("remove_player", game.playersList);
    // if player count is less than 2 then stop and reset the game as it cannot continue.
    if (game.playersList.length < 2) {
      game.reset();
    }
  });
});

/* broadcasting the server api on the network (using the broadcast api i.e, 0.0.0.0) and port 3001
 for players to access and join the game */
server.listen(3001, "0.0.0.0", () => {
  console.log(`Listening at port ${process.env.PORT || "3001"}`);
});
