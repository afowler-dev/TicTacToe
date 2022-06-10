
//==================================
// GameState OBJECT
//==================================

const IDLE = 0;
const PLAYING = 1;
const WON = 2;
const TIE = 3;

// GameState constructor
//=================
function GameState() {
    this.reset();
}

// GameState methods
//=============
GameState.prototype = {

    setPlaying:  function() {
        this.state = PLAYING;
    },

    isPlaying: function() {
        return this.state == PLAYING;
    },

    isTie: function() {
        return this.state == TIE;
    },

    setWinner: function(winner) {
        this.winner = winner;
        this.state = WON;
    },

    setTie: function() {
        this.state = TIE;
    },

    reset: function() {
        this.state = IDLE;
        this.winner = null;
        this.round = 0;
        this.moves = 0;
    }
}

export default GameState;
