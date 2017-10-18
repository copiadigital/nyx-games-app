var Game = {
    hasDemo: function() {
        if(['livetablegame'].indexOf(this.category) > -1){
            return false;
        }

        return true;
    }
}

export default Game;