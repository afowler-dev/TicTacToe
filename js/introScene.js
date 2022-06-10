var IntroScene = function (app) {
    this.app = app;
};

const START_NEW_GAME_TEXT = "Start New Game";
const EXIT_GAME_TEXT = "Exit Game";


IntroScene.prototype = {
    setupScene: function(width, height) {

        // create parent container for this scene
        this.container = new PIXI.Container();
        this.container.width = width;
        this.container.height = height;

        // create a background
        this.background = PIXI.Sprite.from('assets/ttt_bg.jpg');
        this.background.width = this.app.screen.width/2;
        this.background.height = this.app.screen.height/2;
        this.background.x = this.background.width/2;

        // add background 
        this.container.addChild(this.background);

        // Start New Game text style
        const startStyle = new PIXI.TextStyle({
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
            
        // Position text and make interactive
        this.startText = new PIXI.Text(START_NEW_GAME_TEXT, startStyle);
        this.startText.x =  (this.app.screen.width - this.startText.width)/2;
        this.startText.y = this.app.screen.height/2;
        this.startText.interactive = true;
        this.startText.buttonMode = true;

        // setup click event
        this.startText.on('pointerdown', this.onStartGamePressed, this);

        // add text the parent
        this.container.addChild(this.startText);

        // Exit game text style
        const exitStyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 96,
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

        // Position text and make interactive
        this.exitText = new PIXI.Text(EXIT_GAME_TEXT, exitStyle);
        this.exitText.x =  (this.app.screen.width - this.exitText.width)/2;
        this.exitText.y = this.app.screen.height - this.exitText.height;
        this.exitText.interactive = true;
        this.exitText.buttonMode = true;   
        
        // setup click event
        this.exitText.on('pointerdown', this.onExitGamePressed, this);             

        // add to parent
        this.container.addChild(this.exitText);
    }, 

    activate: function() {
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

    onStartGamePressed: function(event) {
        this.signalManager.startNewGameSignal.emit();
    },

    onExitGamePressed: function() {
        this.signalManager.exitGameSignal.emit();
    },
}

export default IntroScene;