window.onload = () => {
    let canvas = document.getElementById('my-canvas');

    init(canvas);
}

var width, height, h3, w3, xOffset, yOffset;
var canvas;
var context;
var over = false;
const board = [[]];
var turn = 'X';
var turns = 0;
var winSpaces = [null, null, null];

function init(canvas) {
    this.canvas = canvas;
    canvas.onmousedown = onClick;
    context = canvas.getContext("2d");
    width = canvas.width;
    height = canvas.height;

    w3 = width / 3;
    h3 = height / 3;

    xOffset = (w3 * 0.15);
    yOffset = (h3 * 0.85);

    for(let i = 0; i < 3; i++) {
        let bb = []

        for(let j = 0; j < 3; j++) {
            bb[j] = null;
        }

        board[i] = bb;
    }

    drawBoard();
}

function onClick(e) {
    if(over) {
        return;
    }

    let x = e.pageX - canvas.offsetLeft;
    let y = e.pageY - canvas.offsetTop;

    let xIndex = Math.floor(x / w3);
    let yIndex = Math.floor(y / h3);

    if(isEmpty(xIndex, yIndex)) {
        board[xIndex][yIndex] = turn;

        let won = checkWin(); //called before render to ensure drawWin has something to draw

        render();

        turns++;

        if(won) {
            end(`${turn} Wins!`);
            return;
        } else {
            if(turns == 9) {
                end(`It's a Draw!`);
                return;
            }
        }

        turn = turn == 'X' ? 'O' : 'X';

        document.title = `Tic-Tac-Toe: ${turn}'s Turn`;
    }
}

function render() {
    drawWin();
    drawMoves();
}

function drawMoves() {
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            if(isEmpty(i, j)) {
                continue;
            }

            let val = board[i][j];

            context.beginPath();
            context.fillStyle = "black";
            context.font = `${w3}px arial`;
            context.fillText(val, (i * w3) + xOffset, (j * h3) + (yOffset));
            context.stroke();
        }
    }
}

function drawBoard() {
    for(let i = 0; i < 3; i++) {
        let x = i * w3;
        let y = i * h3;
        
        context.beginPath();
        context.moveTo(0, x);
        context.lineTo(width, x);
        context.stroke();
        
        context.beginPath();
        context.moveTo(y, 0);
        context.lineTo(y, height);
        context.stroke();
    }
}

function drawWin() {
    for(let i = 0; i < winSpaces.length; i++) {
        let space = winSpaces[i];

        if(space == null) {
            break;
        }

        let coords = getCoords(space);
        let x = coords[0];
        let y = coords[1];

        context.beginPath();
        context.fillStyle = "lime";
        context.rect(x * w3, y * h3, w3, h3);
        context.fill();
        context.stroke();
    }
}

function end(endText) {
    document.title = endText;
    over = true;
}

function isEmpty(x, y) {
    return (board[x][y] == null);
}

function getCoords(i) {
    return [Math.floor(i / 3), Math.floor(i % 3)];
}

function getSpace(i) {
    let coords = getCoords(i);

    return board[coords[0]][coords[1]];
}

function checkWin() {
    for(let i = 0; i < 3; i++) {
        if(match(i * 3, (i * 3) + 1, (i * 3) + 2)) {
            return true;
        }

        if(match(i, i + 3, i + 6)) {
            return true;
        }
    }

    if(match(2, 4, 6)) {
        return true;
    }

    return false;
}

function match(i, j, k) {
    let a = getSpace(i), b = getSpace(j), c = getSpace(k);

    if(a === b && b === c) {
        if(a != null && a != undefined && a != "" && a != " ") {
            winSpaces = [i, j, k];

            return true;
        }
    }

    return false;
}