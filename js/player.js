
//==================================
// Player OBJECT
//==================================

// Player constructor
//=================
function Player(name, marker) {
    this.name = name;
    this.marker = marker;
    this.reset();
}

// Player methods
//=============
Player.prototype = {

    setSignalManager:  function(signalManager) {
        this.signalManager = signalManager;

    },

    addWin: function() {
        this.wins++;
    },

    reset: function() {
        this.wins = 0;
    }
}

export default Player;
 