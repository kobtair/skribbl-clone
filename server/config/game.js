//importing the wordsList from words.js file.
const words = require("./words");

// creating a game class to make a game instance when running the backend.
class Game {
  constructor() {
    // GAME STATE.
    this.playersList = [];
    this.drawer = "";
    this.time = 60;
    this.draw = []
    this.totalTime = 60;
    this.currentWord = "";
    this.drawerWidth = 0;
    this.drawerHeight = 0;
    this.totalRounds = 3;
    this.currentRound = 1;
    this.isStarted = false;
    this.isHintSent = false;
  }
  //adding player to the player list.
  addPlayer(player) {
    this.playersList.push(player);
  }
  // method to get the drawer
  getDrawer() {
    return this.playersList.find(player=> player.isDrawing === true);
  }
  //method to get the players list.
  getPlayers() {
    return this.playersList;
  }
  // method to remove a player from the list.
  removePlayer(playerToRemove) {
    this.playersList = this.playersList.filter(
      (player) => player.id !== playerToRemove
    );
  }
  // method to check if it is the last round.
  checkLastRound(){
    return this.currentRound === this.totalRounds;
  }
  // method to get the game time.
  getTime(){
    return this.time;
  }
  // method to tell game that one second passed and to update the timer.
  oneSecondPassed(){
    this.time--;
  }
  // starting the game.
  startGame() {
    this.isStarted = true;
  }
  // choosing a random player who has not had his turn yet and giving him privelage of choosing
  chooseNextPlayer() {
    // getting the players who havent had their turn.
    const remainingPlayers = this.getRemainingPlayers();
    // if there are no remaining players then start next round and choose next player.
    if (!remainingPlayers.length) {
      this.startNewRound();
      this.chooseNextPlayer();
    }
    // if there are remaining players then choose a random player from the remaining players and give him choosing privelage.
    else {
      const chosenPlayer =
        remainingPlayers[Math.floor(Math.random() * remainingPlayers.length)];
      chosenPlayer.isDone = true;
      chosenPlayer.isChoosing = true;
      chosenPlayer.hasGuessed = true;
      this.drawer = chosenPlayer.username;
    }
  }
  // method to get players who have not had their turn yet.
  getRemainingPlayers() {
    return this.playersList.filter((player) => !player.isDone);
  }
  //choose three random words from word list and return them.
  chooseThreeWords() {
    const shuffledWords = words.sort(() => Math.random() - 0.5);
    return shuffledWords.slice(0, 3);
  }
  // start the next turn and revert the state of all players for next turn.
  startNextTurn() {
    this.playersList.map((player) => (player.hasGuessed = false));
    this.currentWord = "";
    this.isHintSent = false;
  }
  // start new round change the value of round and change isDone state of all players(so they can have one more turn).
  startNewRound() {
    this.currentRound++;
    this.playersList.map((player) => (player.isDone = false));
  }
  // looks at the current word and picks some random indexes to give away as hint.
  getHint() {
    // making the array for storing hint.
    const hint = [];
    // keeping track indexes that have been chosen.
    const indexesDone = [];
    // giving enough hint based on the word i.e, choosing letters at random to giveaway.
    for (let i = 0; i < Math.floor(this.currentWord.length / 2); i++) {
      const randomIndex = Math.floor(Math.random() * this.currentWord.length);
      //checking if random letter has already been chosen as hint if yes, we do one more iteration.
      if (indexesDone.find((index) => index === randomIndex)) {
        i--;
        continue;
      }
      indexesDone.push(randomIndex);
      const correspondingLetter = this.currentWord[randomIndex];
      // storing the index and corresponding letter in the hint array.
      hint.push({ randomIndex, correspondingLetter });
    }
    return hint;
  }
  // making hidden word (e.g "banana" equals [ _ , _ , _ , _ , _ , _ ]) to guess for client.
  getWordToGuess() {
    let wordToGuess = [];
    // going over each letter in the word and making the word to guess.
    for (let i = 0; i < this.currentWord.length; i++) {
      const letter = this.currentWord[i];
      // pushing spaces into the array as.
      if (letter === " ") {
        wordToGuess.push(letter);
      } else {
        wordToGuess.push("_");
      }
    }
    return wordToGuess;
  }
  // reseting the game in case players leave and we want to stop or all rounds have ended so we want to reset.
  reset() {
    this.drawer = "";
    this.time = this.totalTime;
    this.currentWord = "";
    this.totalRounds = 3;
    this.currentRound = 1;
    this.isStarted = false;
    this.isHintSent = false;
    this.playersList.map((player) => {
      player.hasGuessed = false;
      player.isChoosing = false;
      player.isDone = false;
      player.isDrawing = false;
      player.resetScore();
    });
  }
  //method to get users who have guessed.
  getGuessedUsers() {
    return this.playersList.filter((player) => player.hasGuessed);
  }
  // method to reset the timer.
  resetTimer() {
    this.time = this.totalTime;
  }
  //method to reset players state.
  resetPlayerState() {
    this.playersList.map((player) => {
      player.resetState()
    });
  }
  // method to check if everyone has guessed.
  hasEveryoneGuessed() {
    if (this.getGuessedUsers().length === this.playersList.length) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = Game;
