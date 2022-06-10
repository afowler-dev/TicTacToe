import TTTGame from "./tttGame.js";

var tickTackToe;

(function(tickTackToe) {
    var Game = (function() {

        function Game() {
        };

        Game.prototype.initialize = function() {
            this.main = new TTTGame();
        };

        return Game;
    })();

    tickTackToe.Game = Game;
})(tickTackToe || (tickTackToe = {}));


tickTackToe = new tickTackToe.Game();
window.addEventListener('load', tickTackToe.initialize()); 
