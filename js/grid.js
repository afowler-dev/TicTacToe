// Grid constructor
//=================
function Grid() {
    this.cells = new Array(9);
    this.reset(); 
}

// Grid methods
//=============
Grid.prototype = {

    setSignalManager:  function(signalManager) {
        this.signalManager = signalManager;

        this.signalManager.boardUpdatedSignal = new PIXI.Runner('onBoardUpdated');
    },

    // Get free cells in an array.
    // Returns an array of indexs
    getFreeCells: function () {
        var i = 0,
            resultArray = [];
        for (i = 0; i < this.cells.length; i++) {
            if (this.cells[i] === null) {
                resultArray.push(i);
            }
        }
        return resultArray;
    },

    // Get a row (values)
    getRowValues: function (index) {
        if (index !== 0 && index !== 1 && index !== 2) {
            console.error("Wrong arg for getRowValues!");
            return undefined;
        }
        var i = index * 3;
        return this.cells.slice(i, i + 3);
    },

    // get a column (values)
    getColumnValues: function (index) {
        if (index !== 0 && index !== 1 && index !== 2) {
            console.error("Wrong arg for getColumnValues!");
            return undefined;
        }
        var i, column = [];
        for (i = index; i < this.cells.length; i += 3) {
            column.push(this.cells[i]);
        }
        return column;
    },

    // get diagonal cells (values)
    // arg 0: from top-left
    // arg 1: from top-right
    getDiagValues: function (arg) {
        var cells = [];
        if (arg !== 1 && arg !== 0) {
            console.error("Wrong arg for getDiagValues!");
            return undefined;
        } else if (arg === 0) {
            cells.push(this.cells[0]);
            cells.push(this.cells[4]);
            cells.push(this.cells[8]);
        } else {
            cells.push(this.cells[2]);
            cells.push(this.cells[4]);
            cells.push(this.cells[6]);
        }
        return cells;
    },

    // is the cell available
    isCellOpen: function(cell) {
        return this.cells[cell] == null;
    },

    // update a cell with a player pick
    update: function(cell, player) {
        // update the cell with the player
        this.cells[cell] = player;

        // notify about the update
        this.signalManager.boardUpdatedSignal.emit(cell, player);
    },

    // reset the grid
    reset: function () {
        for (var i = 0; i < this.cells.length; i++) {
            this.cells[i] = null;
        }
        return true;
    },
}

export default Grid;
