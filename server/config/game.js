const words = require("./words");

class Game {
  constructor() {
    this.playersList = [];
    this.drawer = "";
    this.time = 60;
    this.currentWord = "";
    this.totalRounds = 3;
    this.currentRound = 1;
    this.isStarted = false;
  }
  addPlayer(player) {
    this.playersList.push(player);
  }
  getPlayers() {
    return this.playersList;
  }
  removePlayer(playerToRemove) {
    this.playersList = this.playersList.filter(
      (player) => player.id !== playerToRemove
    );
  }
  startGame() {
    this.isStarted = true;
  }

  chooseNextPlayer() {
    this.playersList.map((player) => (player.isChoosing = false));
    const remainingPlayers = this.getRemainingPlayers();
    if (!remainingPlayers.length) {
      this.startNewRound();
      this.chooseNextPlayer();
    } else {
      const chosenPlayer =
        remainingPlayers[Math.floor(Math.random() * remainingPlayers.length)];
      chosenPlayer.isDone = true;
      chosenPlayer.isChoosing = true;
      chosenPlayer.hasGuessed = true;
      this.drawer = chosenPlayer.username;
    }
  }
  getRemainingPlayers(){
    return this.playersList.filter((player) => !player.isDone);
  }
  chooseThreeWords() {
    const shuffledWords = words.sort(() => Math.random() - 0.5);
    return shuffledWords.slice(0, 3);
  }
  startNextTurn() {
    this.playersList.map((player) => (player.hasGuessed = false));
    this.currentWord = "";
  }
  startNewRound() {
    this.currentRound++;
    this.playersList.map((player) => (player.isDone = false));
  }
  reset() {
    this.drawer = "";
    this.time = 60;
    this.currentWord = "";
    this.totalRounds = 3;
    this.currentRound = 1;
    this.isStarted = false;
    this.playersList.map(player=>{
      player.hasGuessed = false;
      player.isChoosing = false;
      player.isDone = false;
      player.isDrawing = false;
    })
  }

  getGuessedUsers() {
    return this.playersList.filter((player) => player.hasGuessed);
  }
  resetTimer() {
    this.time = 60;
  }
  resetPlayerState() {
    this.playersList.map((player) => {
      player.isChoosing = false;
      player.hasGuessed = false;
      player.isDrawing = false;
    });
  }
  hasEveryoneGuessed() {
    if (this.getGuessedUsers().length === this.playersList.length) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = Game;
