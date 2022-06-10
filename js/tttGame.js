import Grid from "./grid.js";
import IntroScene from "./introScene.js";
import PlayScene from "./playScene.js";
import ResultsScene from "./resultsScene.js";
import Player from "./player.js";
import GameState from "./gameState.js";
import GameResults from "./gameResults.js";

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PLAYER_1_NAME = "Player 1";
const PLAYER_2_NAME = "Player 2";
const PLAYER_1_MARKER = "X";
const PLAYER_2_MARKER = "O";

var TTTGame = function () {

    // Initialize and setup everything for the game

    // create PIXI canvas and add to DOM
    this.app = new PIXI.Application({ width: GAME_WIDTH, height: GAME_HEIGHT });
    document.body.appendChild(this.app.view);

    // setup game
    this.setupGame();
};

TTTGame.prototype = {
    setupGame: function () {

        // setup signals from scenes 
        this.setupSignals();

        this.gameGrid = new Grid();
        this.gameGrid.setSignalManager(this);

        this.gameState = new GameState();
        
        this.player1 = new Player(PLAYER_1_NAME, PLAYER_1_MARKER);
        this.player2 = new Player(PLAYER_2_NAME, PLAYER_2_MARKER);

        this.gameResults = new GameResults([this.player1, 
                                            this.player2]);

        // Create scenes for the game
        this.createScenes();

        this.initializeGame();

        // signal game is ready to start
        this.gameReadySignal.emit();
    },

    setupSignals: function() {
        this.gameReadySignal = new PIXI.Runner('onGameReady');
        this.gameReadySignal.add(this);

        this.startNewGameSignal = new PIXI.Runner('onStartNewGame');
        this.startNewGameSignal.add(this);

        this.gridClickedSignal = new PIXI.Runner('onGridClicked');
        this.gridClickedSignal.add(this);

        this.roundOverSignal = new PIXI.Runner('onRoundOver');
        this.roundOverSignal.add(this);

        this.rematchGameSignal = new PIXI.Runner('onRematch');
        this.rematchGameSignal.add(this);

        this.exitToMenuSignal = new PIXI.Runner('onExitToMenu');
        this.exitToMenuSignal.add(this);
    },

    createScenes: function() {
        this.introScene = new IntroScene(this.app);
        this.introScene.setupScene(GAME_WIDTH, GAME_HEIGHT);
        this.introScene.setSignalManager(this);

        this.playScene = new PlayScene(this.app);
        this.playScene.setupScene(GAME_WIDTH, GAME_HEIGHT);
        this.playScene.setSignalManager(this);

        this.resultsScene = new ResultsScene(this.app, this.gameResults);
        this.resultsScene.setupScene(GAME_WIDTH, GAME_HEIGHT);
        this.resultsScene.setSignalManager(this);
    },

    initializeGame: function() {
        this.resetGame();
    },

    onGameReady: function() {
        // show intro screen
        this.introScene.activate();
    },

    onGridClicked: function(cellId) {

        // is it a valid move?
        if (!this.gameGrid.isCellOpen(cellId)) {
            // something is wrong! ignore this for now
            return;
        }

        this.gameGrid.update(cellId, this.currentPlayer);

        // keep track of the number of moves played
        this.moves++;

        this.updateGameState();

        // if no one won yet, switch players
        if (this.gameState.isPlaying()) {
            this.currentPlayer = this.currentPlayer == this.player1 ? this.player2 : this.player1;
        } else {
            // announce the winner
            this.playScene.announceWin(this.gameState);
        }
    },

    updateGameState: function() {

        // Check if the game is over and determine winner
        var winner = null;

        // no point checking if played less than 5 moves
        if (this.moves < 5) {
            return;
        }
        // check rows
        for (var i = 0; i <= 2; i++) {
            var row = this.gameGrid.getRowValues(i);
            if (row[0] != null && row[0] == row[1] && row[0] == row[2]) {
                winner = row[0];
                this.playScene.showRowWin(i, winner);
                this.gameState.setWinner(winner);
                winner.addWin();
            }
        }

        // check columns
        for (i = 0; i <= 2; i++) {
            var col = this.gameGrid.getColumnValues(i);
            if (col[0] != null && col[0] == col[1] && col[0] == col[2]) {
                winner = col[0];
                this.playScene.showColumnWin(i, winner);
                this.gameState.setWinner(winner);
                winner.addWin();
            }
        }

        // check diagonals
        for (i = 0; i <= 1; i++) {
            var diagonal = this.gameGrid.getDiagValues(i);
            if (diagonal[0] != null && diagonal[0] == diagonal[1] && diagonal[0] == diagonal[2]) {
                winner = diagonal[0];
                this.playScene.showDiagWin(i, winner);
                this.gameState.setWinner(winner);
                winner.addWin();
            }
        }

        // if we don't have a winner, is it a tie?
        if (this.gameState.isPlaying()) {
            // If the board is full, it's a tie
            var myArr = this.gameGrid.getFreeCells();
            if (myArr.length === 0) {
                this.gameState.setTie();
                this.gameResults.addTie();
            }
        }
    },

    shutDown: function() {
        this.startNewGameSignal.removeAll();
        this.startNewGameSignal = null;
    },

    announceWinner: function(text) {
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 48,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#ffffff', '#00ff00'], 
            stroke: '#4a1850',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
        });
        
        const announceText = new PIXI.Text(text, style);
        announceText.x =  (this.app.screen.width - announceText.width)/2;
        announceText.y = this.app.screen.height/2;

        this.app.stage.addChild(announceText);

        setTimeout(()=>{this.closeAnnounce(announceText);}, 1500);
    },
    
    closeAnnounce: function(text) {
        this.app.stage.removeChild(text)
    },

    onStartNewGame: function() {
        this.introScene.deactivate();
        this.playScene.activate();
        this.resetGame();
    },

    teardownIntroScene: function(){
        this.app.stage.removeChildren();  
    },

    onRoundOver: function() {
        this.playScene.deactivate();
        this.resultsScene.activate();
    },

    onRematch: function() {
        this.resetRound();
        this.resultsScene.deactivate();
        this.playScene.activate();
    },

    onExitToMenu: function() {
        this.resultsScene.deactivate();
        this.introScene.activate();
    },

    resetGame: function() {
        this.gameState.reset();
        this.gameResults.reset();
        this.player1.reset();
        this.player2.reset();
        this.resetRound();
    },

    resetRound: function() {
        this.gameGrid.reset();
        this.moves = 0;
        this.gameOver = false;
        this.currentPlayer = this.player1;
        this.gameState.setPlaying();
    }

};

export default TTTGame;