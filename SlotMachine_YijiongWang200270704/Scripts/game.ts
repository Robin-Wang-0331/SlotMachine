var canvas;
var stage: createjs.Stage;

// Game Objects 
var game: createjs.Container;
var background: createjs.Bitmap;
var betButton: createjs.Bitmap;
var betMaxButton: createjs.Bitmap;
var spinButton: createjs.Bitmap;
var resetButton: createjs.Bitmap;
var quitButton: createjs.Bitmap;
var tiles: createjs.Bitmap[] = [];
var tileContainers: createjs.Container[] = [];
var defaultImages: createjs.Bitmap[] = [];

// Game Variables
var playerMoney: number = 1000;
var MAXBET: number = 500;
var playerBet: number = 0;
var winnings: number = 0; // needs to be reset
var jackpot: number = 5000;
var turn = 0;
var winNumber: number = 0;
var spinResult;
var fruits = "";
var winRatio = 0;
var lossNumber: number = 0;

/* Tally Variables */
var grapes = 0;
var bananas = 0;
var oranges = 0;
var cherries = 0;
var bars = 0;
var bells = 0;
var sevens = 0;
var blanks = 0;

// Game Text
var betText: createjs.Text;
var totalCreditText: createjs.Text;
var winnerPaidText: createjs.Text;



function init() {
    canvas = document.getElementById("canvas");
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver(20); // Enable mouse events
    createjs.Ticker.setFPS(60); // 60 frames per second
    createjs.Ticker.addEventListener("tick", gameLoop);

    main();
}

function gameLoop() {

    stage.update(); // Refreshes our stage
}

// Utility function to reset all fruit tallies
function resetFruitTally() {
    grapes = 0;
    bananas = 0;
    oranges = 0;
    cherries = 0;
    bars = 0;
    bells = 0;
    sevens = 0;
    blanks = 0;
    winnings = 0;
}

// Event handlers
function resetButtonClicked() {

    for (var tile = 0; tile < 3; tile++) {
        if (turn > 0) {
            game.removeChild(tiles[tile]);
        }
        defaultImages[tile] = new createjs.Bitmap("assets/images/seven.png");
        defaultImages[tile].x = 149 + (96 * tile);
        defaultImages[tile].y = 100;
        game.addChild(defaultImages[tile]);
    }

    playerMoney = 1000;
    MAXBET = 500;
    playerBet = 0;
    winnings = 0; // needs to be reset
    jackpot = 5000;
    turn = 0;
    winNumber = 0;
    winRatio = 0;
    lossNumber = 0;

    betText.text = playerBet.toString();
    totalCreditText.text = playerMoney.toString();
    winnerPaidText.text = winnings.toString();
}

function quitButtonClicked() {
    this.close();
}

function betButtonOver() {

}

function betButtonOut() {

}


//bet button's event handlers
function betButtonClicked() {
    if (playerMoney > 0) {
        if (playerBet < MAXBET) {
            playerBet = playerBet + 1;
            //playerMoney = playerMoney - 1;
        } else {
            playerBet = MAXBET;
            alert("Maximum bet");
        }
    } else {
        alert("You don't have enough money");
    }
    betText.text = playerBet.toString();
    totalCreditText.text = playerMoney.toString();

    console.log("bet button clicked");
}

//bet max button event handlers
function betMaxButtonOver() {

}

function betMaxButtonOut() {

}

function betMaxButtonClicked() {
    if (playerMoney >= (MAXBET - playerBet)) {
        if (playerBet < MAXBET) {
            //playerMoney = playerMoney - (MAXBET - playerBet);
            playerBet = MAXBET;
        } else {
            playerBet = MAXBET;
            alert("Maximum bet");
        }
    } else {
        playerBet = playerMoney;
    }

    betText.text = playerBet.toString();
    totalCreditText.text = playerMoney.toString();
    console.log("bet max button clicked");
}

//spin button event handlers
function spinButtonOver() {

}

function spinButtonOut() {

}

function spinButtonClicked() {
    if (playerBet > 0) {
        if (playerBet <= playerMoney) {
            // Add spin reel code
            spinResult = Reels();
            fruits = spinResult[0] + " - " + spinResult[1] + " - " + spinResult[2];

            console.log(fruits);

            // remove 777
            for (var default_num = 0; default_num < 3; default_num++) {
                game.removeChild(defaultImages[default_num]);
            }

            for (var tile = 0; tile < 3; tile++) {
                if (turn > 0) {
                    game.removeChild(tiles[tile]);
                }
                tiles[tile] = new createjs.Bitmap("assets/images/" + spinResult[tile] + ".png");
                tiles[tile].x = 149 + (96 * tile);
                tiles[tile].y = 100;
                game.addChild(tiles[tile]);

            }
            determineWinnings();

            console.log("win: " + winNumber + "    Lost: " + lossNumber);

            //display winning amount
            playerMoney = playerMoney + winnings;
            winnerPaidText.text = winnings.toString();

            //distract bet amount
            playerMoney = playerMoney - playerBet;
            totalCreditText.text = playerMoney.toString();

            turn++;
            resetFruitTally();
        } else if (playerBet > playerMoney && playerMoney > 0) {
            playerBet = playerMoney;
            betText.text = playerBet.toString();

        } else if (playerBet > playerMoney && playerMoney <= 0) {
            alert("you don't have enough money to play! Game Over");
        }
    } else {
        alert("Please Bet!");
    }
}

// Utility function to check if a value falls within a range of bounds
function checkRange(value, lowerBounds, upperBounds) {
    if (value >= lowerBounds && value <= upperBounds) {
        return value;
    } else {
        return !value;
    }
}

//When this function is called it determines the betline results. e.g. Bar - Orange - Banana
function Reels() {
    var betLine = [" ", " ", " "];
    var outCome = [0, 0, 0];

    for (var spin = 0; spin < 3; spin++) {
        outCome[spin] = Math.floor((Math.random() * 65) + 1);
        switch (outCome[spin]) {
            case checkRange(outCome[spin], 1, 27):  // 41.5% probability
                betLine[spin] = "blank";
                blanks++;
                break;
            case checkRange(outCome[spin], 28, 37): // 15.4% probability  28  37
                betLine[spin] = "grapes";
                grapes++;
                break;
            case checkRange(outCome[spin], 38, 46): // 13.8% probability
                betLine[spin] = "banana";
                bananas++;
                break;
            case checkRange(outCome[spin], 47, 54): // 12.3% probability
                betLine[spin] = "orange";
                oranges++;
                break;
            case checkRange(outCome[spin], 55, 59): //  7.7% probability
                betLine[spin] = "cherry";
                cherries++;
                break;
            case checkRange(outCome[spin], 60, 62): //  4.6% probability
                betLine[spin] = "bar";
                bars++;
                break;
            case checkRange(outCome[spin], 63, 64): //  3.1% probability
                betLine[spin] = "bell";
                bells++;
                break;
            case checkRange(outCome[spin], 65, 65): //  1.5% probability
                betLine[spin] = "seven";
                sevens++;
                break;
        }
    }
    return betLine;
}


/* This function calculates the player's winnings, if any */
function determineWinnings() {
    if (blanks == 0) {
        if (grapes == 3) {
            winnings = playerBet * 10;
        }
        else if (bananas == 3) {
            winnings = playerBet * 20;
        }
        else if (oranges == 3) {
            winnings = playerBet * 30;
        }
        else if (cherries == 3) {
            winnings = playerBet * 40;
        }
        else if (bars == 3) {
            winnings = playerBet * 50;
        }
        else if (bells == 3) {
            winnings = playerBet * 75;
        }
        else if (sevens == 3) {
            winnings = playerBet * 100;
        }
        else if (grapes == 2) {
            winnings = playerBet * 2;
        }
        else if (bananas == 2) {
            winnings = playerBet * 2;
        }
        else if (oranges == 2) {
            winnings = playerBet * 3;
        }
        else if (cherries == 2) {
            winnings = playerBet * 4;
        }
        else if (bars == 2) {
            winnings = playerBet * 5;
        }
        else if (bells == 2) {
            winnings = playerBet * 10;
        }
        else if (sevens == 2) {
            winnings = playerBet * 20;
        }
        else {
            winnings = playerBet * 1;
        }

        if (sevens == 1) {
            winnings = playerBet * 5;
        }
        winNumber++;
    }
    else {
        lossNumber++;
    }

}

function createUI():void {
    // intiate my background
    background = new createjs.Bitmap("assets/images/SlotMachine.jpg");

    game.addChild(background);

    //bet button
    betButton = new createjs.Bitmap("assets/images/BetButton.jpg");
    betButton.x = 96;
    betButton.y = 218;
    game.addChild(betButton);
    betButton.addEventListener("mouseover", betButtonOver);
    betButton.addEventListener("mouseout", betButtonOut);
    betButton.addEventListener("click", betButtonClicked);

    //bet max button
    betMaxButton = new createjs.Bitmap("assets/images/BetMaxButton.jpg");
    betMaxButton.x = 233;
    betMaxButton.y = 216;
    game.addChild(betMaxButton);
    betMaxButton.addEventListener("mouseover", betMaxButtonOver);
    betMaxButton.addEventListener("mouseout", betMaxButtonOut);
    betMaxButton.addEventListener("click", betMaxButtonClicked);

    //spin button
    spinButton = new createjs.Bitmap("assets/images/SpinButton.jpg");
    spinButton.x = 164;
    spinButton.y = 217;
    game.addChild(spinButton);
    
    spinButton.addEventListener("mouseover", spinButtonOver);
    spinButton.addEventListener("mouseout", spinButtonOut);
    spinButton.addEventListener("click", spinButtonClicked);
    

    //reset button
    resetButton = new createjs.Bitmap("assets/images/SpinButton.jpg");
    resetButton.x = 301;
    resetButton.y = 217;
    game.addChild(resetButton);
    resetButton.addEventListener("click", resetButtonClicked);

    //quit button
    quitButton = new createjs.Bitmap("assets/images/SpinButton.jpg");
    quitButton.x = 369;
    quitButton.y = 217;
    game.addChild(quitButton);
    quitButton.addEventListener("click", quitButtonClicked);

    // bet text
    betText = new createjs.Text(playerBet.toString(), "15px Impact", "#FF0000");
    betText.x = 192;
    betText.y = 187;
    game.addChild(betText);

    // total credit text
    totalCreditText = new createjs.Text(playerMoney.toString(), "15px Impact", "#FF0000");
    totalCreditText.x = 114;
    totalCreditText.y = 187;
    game.addChild(totalCreditText);

    // winner paid text
    winnerPaidText = new createjs.Text(winnings.toString(), "15px Impact", "#FF0000");
    winnerPaidText.x = 231;
    winnerPaidText.y = 187;
    game.addChild(winnerPaidText);

    for (var tile = 0; tile < 3; tile++) {
        defaultImages[tile] = new createjs.Bitmap("assets/images/seven.png");
        defaultImages[tile].x = 149 + (96 * tile);
        defaultImages[tile].y = 100;
        game.addChild(defaultImages[tile]);
    }

}



// Our Game Kicks off in here
function main() {
    // instantiate my game container
    game = new createjs.Container();
    stage.addChild(game);
    createUI();
}