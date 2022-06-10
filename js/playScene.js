
var PlayScene = function (app) {
    this.app = app;
};

PlayScene.prototype = {
    setupScene: function(width, height) {

        this.xTexture = PIXI.Texture.from('assets/x.jpg');
        this.oTexture = PIXI.Texture.from('assets/o.jpg');
        this.blankTexture = PIXI.Texture.from('assets/blank.jpg');

        // graphic for win line
        this.winLineBox = new PIXI.Graphics();
        this.winLineBox.width = 600;
        this.winLineBox.height = 600;

        // create parent container for this scene
        this.container = new PIXI.Container();
        this.container.width = width;
        this.container.height = height;

        // Create a new Graphics object and add it to the scene
        this.board = new PIXI.Graphics();

        // Move it to the beginning of the line
        this.board.position.set(100, 0);
        this.board.width = 600;
        this.board.height = 600;
        
        // Draw the grid 
        this.board.lineStyle(2, 0xffffff)
                .moveTo(200, 0)
                .lineTo(200, 600);

        this.board.lineStyle(2, 0xffffff)
                .moveTo(400, 0)
                .lineTo(400, 600);

                this.board.lineStyle(2, 0xffffff)
                .moveTo(0, 200)
                .lineTo(600, 200);

                this.board.lineStyle(2, 0xffffff)
                .moveTo(0, 400)
                .lineTo(600, 400);

        
        this.container.addChild(this.board);

        this.boardSprites = [];

        // fill grid with blank sprites
        for(let x = 0; x < 3 ; x++) {
            for(let y = 0; y < 3 ; y++) {
                var blank_piece = PIXI.Sprite.from(this.blankTexture);
                blank_piece.width = 198;
                blank_piece.height = 198;
                blank_piece.x = x * 200;
                blank_piece.y = y * 200;
                blank_piece.interactive = true;
                blank_piece.buttonMode = true;   
                blank_piece.id = x+(y*3);
                blank_piece.on('pointerdown', this.onGamePieceClicked, this);
                this.board.addChild(blank_piece);
                this.boardSprites[blank_piece.id]=blank_piece;
            }
        }

        this.announceContainer = new PIXI.Container();
        this.announceContainer.width = width;
        this.announceContainer.height = height;
    },

    activate: function() {
        // reset the scene for new round
        this.resetScene();
        // make the scene visible
        this.app.stage.addChild(this.container);
    },
   
    deactivate: function() {
        this.resetScene();
        // make the scene invisible
        this.app.stage.removeChild(this.container);
    },
   
    setSignalManager: function(signalManager) {
        this.signalManager = signalManager;

        // let me know when the grid model gets updated, so we can update the UI
        this.signalManager.boardUpdatedSignal.add(this);
    },

    onGamePieceClicked: function(event) {
        // signal that a square was click with the id
        this.signalManager.gridClickedSignal.emit(event.target.id);
    },

    onBoardUpdated: function(cell, player) {
        this.boardSprites[cell].texture = player.marker == "X" ? this.xTexture : this.oTexture;
        this.boardSprites[cell].interactive = false;
        this.boardSprites[cell].buttonMode = false;
    },

    showRowWin: function(row) {
        this.winLineBox.lineStyle(10, 0xff0000)
                        .moveTo(50, 100+(row*200))
                        .lineTo(550, 100+(row*200));
        this.board.addChild(this.winLineBox);
    },

    showColumnWin: function(col) {
        this.winLineBox.lineStyle(10, 0xff0000)
                        .moveTo(100+(col*200), 50)
                        .lineTo(100+(col*200), 550);
        this.board.addChild(this.winLineBox);
    },

    showDiagWin: function(diag) {
        if (diag == 0) {
            this.winLineBox.lineStyle(10, 0xff0000)
                            .moveTo(50, 50)
                            .lineTo(550, 550);
            this.board.addChild(this.winLineBox);
        } else {
            this.winLineBox.lineStyle(10, 0xff0000)
                            .moveTo(550, 50)
                            .lineTo(50, 550);
            this.board.addChild(this.winLineBox);
        }
    },

    announceWin: function(gameState) {
        var text;

        this.enableBoard(false);

        if(gameState.isTie()) {
            text = "It's a tie!";
        } else {
            text = ` Congratulations!\n${gameState.winner.name}, you won!`;
        }

        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 48,
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
        
        // center text on screen
        const announceText = new PIXI.Text(text, style);
        announceText.x =  (this.app.screen.width - announceText.width)/2;
        announceText.y = (this.app.screen.height - announceText.height)/2;
    
        this.container.alpha = 0.5;

        this.announceContainer.addChild(announceText);      
        this.app.stage.addChild(this.announceContainer);

        setTimeout(()=>{this.closeWinAnnounce(announceText);}, 1500);
    },

    closeWinAnnounce: function() {
        this.announceContainer.removeChildren();
        this.signalManager.roundOverSignal.emit();
    },

    resetScene: function() {
        // reset all the board pieces to blank
        this.boardSprites.forEach(sprite => {
            sprite.texture = this.blankTexture;
        });
        this.enableBoard(true);
        
        // clear the container with the announcements
        this.app.stage.removeChild(this.announceContainer);
        this.announceContainer.removeChildren();

        // reset the board alpha
        this.container.alpha = 1;

        // remove and clear the winlines
        this.board.removeChild(this.winLineBox);
        this.winLineBox.clear();
    },

    enableBoard: function(state) {
        this.boardSprites.forEach(sprite => {
            sprite.interactive = state;
            sprite.buttonMode = state;
        });
    },
}

export default PlayScene;