class Player{
    constructor(id, username, avatar){
        this.username = username;
        this.id = id;
        this.avatar = avatar;
        this.isDrawing = false;
        this.score = 0;       
        this.isDone = false; 
        this.hasGuessed = false;
        this.isChoosing = false;
    }
    resetScore(){
        this.score = 0;
    }
    newRound(){
        this.isDrawing = false;
        this.isDone = false;
    }
}

module.exports = Player;