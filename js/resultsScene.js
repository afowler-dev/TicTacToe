var ResultsScene = function (app, results) {
    this.app = app;
    this.results = results;
};

var REMATCH_TEXT = "Rematch?";
var MAIN_MENU_TEXT  = "Main Menu";
var SCORE_TEXT = "Score";
var PLAYER_1_WINS_TEXT = 'Player 1 Wins'
var PLAYER_2_WINS_TEXT = 'Player 2 Wins'
var TIES_TEXT = "Ties";

ResultsScene.prototype = {
    setupScene: function(width, height) {

        // create parent container for this scene
        this.container = new PIXI.Container();
        this.container.width = width;
        this.container.height = height;

        // create a background
        this.background = PIXI.Sprite.from('assets/tttresults_bg.jpg');
        this.background.width = this.app.screen.width;
        this.background.height = this.app.screen.height;

        // add background 
        this.container.addChild(this.background);

        // Start New Game text style
        const resultsBigStyle = new PIXI.TextStyle({
                fontFamily: 'Arial',
                fontSize: 96,
                fontStyle: 'italic',
                fontWeight: 'bold',
                fill: ['#ffffff', '#00ff00'], // gradient
                stroke: '#4a1850',
                strokeThickness: 5,
                dropShadow: true,
                dropShadowColor: '#000000',
                dropShadowBlur: 4,
                dropShadowAngle: Math.PI / 6,
                dropShadowDistance: 6,
            });

        const resultsSmallStyle = new PIXI.TextStyle({
                fontFamily: 'Arial',
                fontSize: 24,
                fontStyle: 'italic',
                fontWeight: 'bold',
                fill: ['#ffffff', '#00ff00'], // gradient
                stroke: '#4a1850',
                strokeThickness: 5,
                dropShadow: true,
                dropShadowColor: '#000000',
                dropShadowBlur: 4,
                dropShadowAngle: Math.PI / 6,
                dropShadowDistance: 6,
            });  
        // Score title 
        this.scoreText = new PIXI.Text(SCORE_TEXT, resultsBigStyle);
        this.scoreText.x =  (this.app.screen.width - this.scoreText.width)/2;
        this.scoreText.y = this.app.screen.height*0.1;
        this.container.addChild(this.scoreText);

        // results board titles
        this.player1Text = new PIXI.Text(PLAYER_1_WINS_TEXT, resultsSmallStyle);
        this.player1Text.x =  (this.app.screen.width - this.player1Text.width)*.3;
        this.player1Text.y = this.app.screen.height*0.3;
        this.container.addChild(this.player1Text);

        this.player2Text = new PIXI.Text(PLAYER_2_WINS_TEXT, resultsSmallStyle);
        this.player2Text.x =  (this.app.screen.width - this.player1Text.width)*.6;
        this.player2Text.y = this.app.screen.height*0.3;
        this.container.addChild(this.player2Text);

        this.tiesText = new PIXI.Text(TIES_TEXT, resultsSmallStyle);
        this.tiesText.x =  (this.app.screen.width - this.player1Text.width)*.9;
        this.tiesText.y = this.app.screen.height*0.3;
        this.container.addChild(this.tiesText);

        // results values
        this.player1WinsText = new PIXI.Text('0', resultsBigStyle);
        this.player1WinsText.x =  (this.app.screen.width - this.player1Text.width)*.3;
        this.player1WinsText.y = this.app.screen.height*0.4;
        this.container.addChild(this.player1WinsText);

        this.player2WinsText = new PIXI.Text('0', resultsBigStyle);
        this.player2WinsText.x =  (this.app.screen.width - this.player1Text.width)*.6;
        this.player2WinsText.y = this.app.screen.height*0.4;
        this.container.addChild(this.player2WinsText);

        this.tiesCountText = new PIXI.Text('0', resultsBigStyle);
        this.tiesCountText.x =  (this.app.screen.width - this.player1Text.width)*.9;
        this.tiesCountText.y = this.app.screen.height*0.4;
        this.container.addChild(this.tiesCountText);

        // rematch or main menu
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
        
        // center text on screen
        const rematchText = new PIXI.Text(REMATCH_TEXT, style);
        rematchText.x =  (this.app.screen.width - rematchText.width)/2;
        rematchText.y = (this.app.screen.height - rematchText.height)*.75;
        
        // setup click event
        rematchText.interactive = true;
        rematchText.buttonMode = true;
        rematchText.on('pointerdown', this.onRematchPressed, this);
        this.container.addChild(rematchText);      
    
        // center text on screen
        const redStyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 48,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#ffffff', '#ff0000'], 
            stroke: '#4a1850',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
        });        
        const mainMenuText = new PIXI.Text(MAIN_MENU_TEXT, redStyle);
        mainMenuText.x =  (this.app.screen.width - mainMenuText.width)/2;
        mainMenuText.y = (this.app.screen.height - mainMenuText.height)*.95;
    
        // setup click event
        mainMenuText.interactive = true;
        mainMenuText.buttonMode = true;
        mainMenuText.on('pointerdown', this.onMainMenuPressed, this);
        this.container.addChild(mainMenuText);      
    }, 

    activate: function() {
        this.player1WinsText.text = this.results.players[0].wins;
        this.player2WinsText.text = this.results.players[1].wins;
        this.tiesCountText.text = this.results.ties;
        // make the scene visible
        this.app.stage.addChild(this.container);
    },
   
    deactivate: function() {
        // make the scene visible
        this.app.stage.removeChild(this.container);
    },
   
    setSignalManager: function(signalManager) {
        this.signalManager = signalManager;
    },

    onRematchPressed: function() {
        this.signalManager.rematchGameSignal.emit();
    },

    onMainMenuPressed: function() {
        this.signalManager.exitToMenuSignal.emit();
    },
}

export default ResultsScene;
