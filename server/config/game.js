class Game{
    constructor(name){
        this.name = name;
        this.playersList = [];
        this.drawer = "";
        this.time = 0;
        this.currentWord= "";
        this.totalRounds = 3;
        this.currentRound = 1;



    }
    addPlayer(player){
        this.playersList.push(player);
    }
    getPlayers(){
        return this.playersList;
    }
    removePlayer(playerToRemove){
        this.playersList = this.playersList.filter(player => player.id!==playerToRemove)
    }

}


module.exports = Game;