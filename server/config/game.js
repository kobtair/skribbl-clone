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
    const remainingPlayers = this.playersList.filter((player) => !player.isDone);
    if (!remainingPlayers.length) {
      this.startNewRound();
    } else {
      const chosenPlayer =
        remainingPlayers[Math.floor(Math.random() * remainingPlayers.length)];
      chosenPlayer.isDone = true;
      chosenPlayer.isChoosing = true;
      chosenPlayer.hasGuessed = true;
      this.drawer = chosenPlayer.username;
    }
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
    this.time = 0;
    this.playersList.map((player) => (player.isDone = false));
  }
  reset(){
    this.drawer = "";
    this.time = 60;
    this.currentWord = "";
    this.totalRounds = 3;
    this.currentRound = 1;
    this.isStarted = false;
  }
}

module.exports = Game;
