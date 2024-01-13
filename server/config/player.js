/* making a Player class so we can instanciate and push a player object
 and push it in the game when a player joins. */
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
    //method to reset score.
    resetScore(){
        this.score = 0;
    }
    // method to reset player state.
    resetState(){
        this.isChoosing = false;
        this.hasGuessed = false;
        this.isDrawing = false;
    }
}

module.exports = Player;