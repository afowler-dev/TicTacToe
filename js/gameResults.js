
//==================================
// GameResults OBJECT
//==================================


// GameResults constructor
//=================
function GameResults(players) {
    this.reset();
    this.players = players;
}

// GameResults methods
//=============
GameResults.prototype = {

    reset: function() {
        this.ties = 0;
    },

    addTie: function() {
        this.ties++;
    }

}

export default GameResults;
