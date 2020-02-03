// Variables

let newPositionY, newPositionX, oldPositionY, oldPositionX;
let originalLocationId;
let isNewPositionYSmaller, isNewPositionXSmaller;
let whiteToolsNumber = 12, blackToolsNumber = 12;
let isGameOver = false;
let isWhiteWon, isBlackWon;
let isBlackToolInsideJump, isWhiteToolInsideJump;
let demo = false;
let isWhiteTurn = true;
let isLegalMovement = false;
let idOneInsideJump, idTwoInsideJump, idThreeInsideJump, idFourInsideJump;
let toolSymbol;
let whitePawnSymbol = "checkers_PNG17.png";
let blackPawnSymbol = "toolBlackPng.png";
let whiteKingToolSymbol = "whiteKing.png";
let blackKingToolSymbol = "blackKing.png";
let emptyImage = "Empty.png"
let isExtraJump = false;
let selectedTool = document.getElementsByClassName("dark");
let savedOldPositionY;
let savedOldPositionX;
let savedNewPositionY;
let savedNewPositionX;
let isForcedJump = false;
let isToolTaken = false;
let isExtraForcedJump = false;

//  Running Begins
for (var i = 0; i < 64; i++) {
  document.getElementsByClassName("dark")[i].draggable = "true";
  document.getElementsByClassName("dark")[i].setAttribute("ondrag", "event.dataTransfer.setData('text/plain',null)");
}
document.getElementById("chessBoard").addEventListener("drag", originalLocationEvent);

// event first click

function originalLocationEvent(event) {
  originalLocationId = event.target.id;
  oldPositionY = parseInt(event.target.id.slice(1, 2));
  oldPositionX = parseInt(event.target.id.slice(2, 3));
  console.log(oldPositionY);
  console.log(oldPositionX);
  toolSymbol = event.target.getAttribute("src");
  if (isWhiteTurn && ((toolSymbol == whitePawnSymbol) || (toolSymbol == whiteKingToolSymbol)) ||
    (!isWhiteTurn && ((toolSymbol == blackPawnSymbol) || (toolSymbol == blackKingToolSymbol)))) {
    //removeAllToolSelection();
    //event.target.className = event.target.className + " " + "toolSelected";
    document.getElementById("chessBoard").removeEventListener("drag", originalLocationEvent);
    document.getElementById("chessBoard").addEventListener("dragover", destinationEvent);
  }
}

// event second click

function destinationEvent(event) {
  newPositionY = parseInt(event.target.id.slice(1, 2));
  newPositionX = parseInt(event.target.id.slice(2, 3));
  console.log(newPositionY);
  console.log(newPositionX);
  changeBooleansToFalse();
  toolSymbol = document.getElementById("a" + oldPositionY + oldPositionX).getAttribute("src");
  checkMovement();
  if (isLegalMovement/* && !(newPositionY === oldPositionY && newPositionX === oldPositionX)*/) {
    document.getElementById("a" + newPositionY + newPositionX).setAttribute("src", toolSymbol);
    document.getElementById("a" + oldPositionY + oldPositionX).setAttribute("src", emptyImage);
    document.getElementById("chessBoard").removeEventListener("dragover", destinationEvent);
    checkCoronation();
      if (!isWhiteTurn && !canAnyWhiteToolMove ()) // if the white can not move, this is victory
      {
          gameOverDeclaration();
      }
      if (isWhiteTurn && !canAnyBlackToolMove ()) // if the black can not move, this is victory
      {
          gameOverDeclaration();
      }
      if(!isGameOver){
      cancelAnouncingForcedJump();
      }
    checkToolsNumber();
    if (isToolTaken) {
      checkExtraForcedJumpAndReact();
    }
    if(!isExtraForcedJump) {
    changePlayerTurn();
    document.getElementById("chessBoard").removeEventListener("dragover", destinationEvent);
    document.getElementById("chessBoard").addEventListener("drag", originalLocationEvent);
    }
    checkCoronation();
  }
  if (!isLegalMovement) { 
    document.getElementById("chessBoard").removeEventListener("dragover", destinationEvent);
    document.getElementById("chessBoard").addEventListener("drag", originalLocationEvent);
  }
}

// ------------- functions--------------//

// Change Booleans to false

function changeBooleansToFalse() {
  demo = false;
  isLegalMovement = false;
  isBlackToolInsideJump = false;
  isWhiteToolInsideJump = false;
  isForcedJump = false;
  isToolTaken = false;
  isExtraForcedJump = false;
}

// switch turns

function changePlayerTurn() {
    if (isWhiteTurn) {
       document.getElementById("pTurn").innerText = "Black";
       isWhiteTurn = false;
    } else {
       document.getElementById("pTurn").innerText = "White";
       isWhiteTurn = true;
  }
}

// Movement

function checkMovement() {
  if (toolSymbol == blackPawnSymbol || toolSymbol == whitePawnSymbol) {
    checkRegularMovement();
    if (!isLegalMovement && isWhiteTurn)
      checkJumpWhiteMovement();
    if ((!isLegalMovement && !isWhiteTurn))
      checkJumpBlackMovement();
  } 
  toolSymbol = document.getElementById("a" + oldPositionY + oldPositionX).getAttribute("src");
  if (toolSymbol == whiteKingToolSymbol || toolSymbol == blackKingToolSymbol) {
      checkMovementKings();
    }
  if(!isToolTaken) {
      checkForcedJump ();
    }
}

function checkForcedJump () {
    if (isWhiteTurn) {
      checkForcedWhitePawnJump();
      returnSavedXYValues();
    }
    if (!isWhiteTurn) {
     checkForcedBlackPawnJump();
     returnSavedXYValues();
    }
      checkForcedKingsJump();
      returnSavedXYValues();
    if ((isForcedJump == true) && (!isToolTaken)) {
    isLegalMovement = false;
    announcePlayerForcedJump ();
    changeBooleansToFalse();
  }
}
//  Pawn Movement (& Involved Pawn/king Movement)

function checkRegularMovement() {
  if ((Math.abs(newPositionX - oldPositionX) == 1) && (event.target.getAttribute("src") == emptyImage)) {
    if (isWhiteTurn && (newPositionY - 1 == oldPositionY)) {
      isLegalMovement = true;
    }
    if (!isWhiteTurn && (oldPositionY - 1 == newPositionY)) {
      isLegalMovement = true;
    }
  }
}

function checkJumpWhiteMovement() {
  var array1 = canPawnOrKingMoveArray1(oldPositionX, oldPositionY, newPositionX, newPositionY);
  if(array1[0] == true) {
  isLegalMovement = true;
   isToolTaken = true;
   if (!demo) {
     blackToolsNumber--;
     document.getElementById("p2").innerText = "" + blackToolsNumber;
     document.getElementById("a" + array1[1] + array1[2]).setAttribute("src", emptyImage);
   }
 }
}

function checkJumpBlackMovement() {
   var array1 = canPawnOrKingMoveArray1(oldPositionX, oldPositionY, newPositionX, newPositionY);
   if(array1[0] == true) {
 isLegalMovement = true;
   isToolTaken = true;
   if (!demo) {
     whiteToolsNumber--;
     document.getElementById("p1").innerText = "" + whiteToolsNumber;
     document.getElementById("a" + array1[1] + array1[2]).setAttribute("src", emptyImage);
   }
 }
}



//  Forced Jump movement Kings

function checkForcedKingsJump  () {
  saveXYValues ();
  for (var i=0 ; (i < document.getElementsByClassName("dark").length) && (!isForcedJump) ; i++){
     if (((isWhiteTurn) && (selectedTool[i].getAttribute("src") == whiteKingToolSymbol)) || ((!isWhiteTurn) && (selectedTool[i].getAttribute("src") == blackKingToolSymbol)))
      {
        strOldPositionY = selectedTool[i].id.slice(1, 2);
        strOldPositionX = selectedTool[i].id.slice(2, 3);
        oldPositionY = parseInt(strOldPositionY);
        oldPositionX = parseInt(strOldPositionX);
       checkDownMovementOutOfArray();
       checkUpMovementOutOfArray();
      } 
  }
}



// Check all board cells to see if any Tool can move

function canAnyBlackToolMove()
{
    let toolSymbolFor;

    for (var x = 0; x <=7; x++)
    {
        for (var y = 0; y <=7; y++)
        {
            toolSymbolFor = getToolSymbolAt(x, y);

            if ( isWhiteTurn && ((toolSymbolFor == blackKingToolSymbol) || (toolSymbolFor == blackPawnSymbol)))
            {
                if (canToolMove(x, y))
                {
                    return true;
                }
            }
        }
    }
    return false;
}

function canAnyWhiteToolMove()
{
    let toolSymbolFor;

    for (var x = 0; x <=7; x++)
    {
        for (var y = 0; y <=7; y++)
        {
            toolSymbolFor = getToolSymbolAt(x, y);

            if (!isWhiteTurn && ((toolSymbolFor == whiteKingToolSymbol) || (toolSymbolFor == whitePawnSymbol)))
            {
                if (canToolMove(x, y))
                {
                    return true;
                }
            }
        }
    }
    return false;
}

// Make sure not to get out of array/board

function isLocationInsideBoard(x, y)
{
    if ((x >= 0) && (y >= 0) && (x <= 7) && (y <= 7))
    {
        return true;
    }
    return false;
}


 // Return the tool symbol in a specific cell/square

function getToolSymbolAt(x, y)
{
    let toolAtCell = document.getElementById("a" + y + x);
    let toolSymbolFor = toolAtCell.getAttribute("src");
    return toolSymbolFor;
}

// Check if the cell/square is is Empty

function isCellEmpty(x, y)
{
    let toolSymbolFor = getToolSymbolAt(x, y);
    if (toolSymbolFor == emptyImage)
    {
        return true;
    }
    return false;
}

function canToolMove(x, y)
{
  let notAnyToolCanMoveCheck = true;
    let xTo, yTo;
    let MovementDirection = 1;
    let toolSymbolFor = getToolSymbolAt(x, y);

    if ((toolSymbolFor == blackPawnSymbol) || (toolSymbolFor == whitePawnSymbol))
    {
        if (toolSymbolFor == blackPawnSymbol)
            MovementDirection = -1; // black moves up

        // loop all four places the pawn can move
        if (canPawnOrKingMove(notAnyToolCanMoveCheck, x, y, x + 1, (y + MovementDirection)) == true)
            return true;

        if (canPawnOrKingMove(notAnyToolCanMoveCheck, x, y, x - 1, (y + MovementDirection)) == true)
            return true;

        if (canPawnOrKingMove(notAnyToolCanMoveCheck, x, y, x + 2, y + (2 * MovementDirection)) == true)
            return true;

        if (canPawnOrKingMove(notAnyToolCanMoveCheck, x, y, x - 2, y + (2 * MovementDirection)) == true)
            return true;
    }

    if ((toolSymbolFor == blackKingToolSymbol) || (toolSymbolFor == whiteKingToolSymbol))
    {
        // loop all cells the king can move to
        for (var xJump = -2; xJump <= 2; xJump++)
        {
            for (var yJump = -2; yJump <= 2; yJump++)
            {
                if ((xJump != 0) && (yJump != 0) && (Math.abs(xJump) == Math.abs(yJump))) // if it is a cell we can jump to (diagonal jump)
                {
                    if (canPawnOrKingMove(notAnyToolCanMoveCheck, x, y, x + xJump, y + yJump))
                    {
                        return true;
                    }
                }
            }
        }
    }

    return false;
}


 // check if a pawn or king can move from (xFrom, yFrom) to (xTo, yTo) And Also check when bollean argument is false
 // if jump\tool taking is possible
 // (disregarding tool direction)

function canPawnOrKingMove(notAnyToolCanMoveCheck, xFrom, yFrom, xTo, yTo)
{
  
    if (isLocationInsideBoard (xFrom, yFrom) && isLocationInsideBoard(xTo, yTo))
    {
        // check if destination cell is empty
        if ((Math.abs(xTo - xFrom) == 1) && notAnyToolCanMoveCheck == true)
        {
            return isCellEmpty (xTo, yTo); // return true if the cell is really empty for this values
        }

        // if we jump, test if there is a tool of other color within
        if (Math.abs(xTo - xFrom) == 2)
        {
            if (isCellEmpty(xTo, yTo))
            {
                let xMiddle = (xTo + xFrom) / 2;
                let yMiddle = (yTo + yFrom) / 2;
                let myTool = getToolSymbolAt(xFrom, yFrom);
                let toolInTheMiddle = getToolSymbolAt(xMiddle, yMiddle);

                if ((myTool == whitePawnSymbol) || (myTool == whiteKingToolSymbol))
                {
                    if ((toolInTheMiddle == blackPawnSymbol) || (toolInTheMiddle == blackKingToolSymbol))
                    {
                        return true; // white pawn can eat black pawn or king
                    }
                }

                if ((myTool == blackPawnSymbol) || (myTool == blackKingToolSymbol))
                {
                    if ((toolInTheMiddle == whitePawnSymbol) || (toolInTheMiddle == whiteKingToolSymbol))
                    {
                        return true; // black pawn can eat white pawn or king
                    }
                }
            }
        }
    }
    return false;
}



    function announcePlayerForcedJump () {
      document.getElementById("lastLine").innerText = " " + (isWhiteTurn ? "White Player" : "Black Player ") + " You Have a Forced Tool taking ";
    }

    function announcePlayerExtraForcedJump () {
        document.getElementById("lastLine").innerText = " " + (isWhiteTurn ? "White Player" : "Black Player ") + " You Have One More Forced Tool taking ";
      }
    
    function cancelAnouncingForcedJump() {
      document.getElementById("lastLine").innerText = " ";
    }

  //  ----functions for forced Jump movement---

// Extra forced jump

function checkExtraForcedJumpAndReact(){
  expectedOldPositionX = newPositionX;
  expectedOldPositionY = newPositionY;
  if(ExtraForcedJump(parseInt(expectedOldPositionX), parseInt(expectedOldPositionY))) {
    isExtraForcedJump = true;
    announcePlayerExtraForcedJump();
    document.getElementById("chessBoard").removeEventListener("dragover", destinationEvent);
    document.getElementById("chessBoard").addEventListener("drag", originalLocationEvent);
  }
}


function ExtraForcedJump(x, y)
{
  let notAnyToolCanMoveCheck = false
    let xTo, yTo;
    let MovementDirection = 1;
    let toolSymbolFor = getToolSymbolAt(newPositionX, newPositionY);

    if ((toolSymbolFor == blackPawnSymbol) || (toolSymbolFor == whitePawnSymbol))
    {
        if (toolSymbolFor == blackPawnSymbol)
            MovementDirection = -1; // black moves up, Y number is getting smaller

        // loop two directions the pawn can jump

        if (canPawnOrKingMove(notAnyToolCanMoveCheck, x, y, x + 2, y + (2 * MovementDirection)) == true)
            return true;

        if (canPawnOrKingMove(notAnyToolCanMoveCheck, x, y, x - 2, y + (2 * MovementDirection)) == true)
            return true;
    }

    if ((toolSymbolFor == blackKingToolSymbol) || (toolSymbolFor == whiteKingToolSymbol))
    {
        // loop all cells the king can move to
        for (var xJump = -2; xJump <= 2; xJump++)
        {
            for (var yJump = -2; yJump <= 2; yJump++)
            {
                if ((xJump != 0) && (yJump != 0) && (Math.abs(xJump) == Math.abs(yJump)) && (Math.abs(xJump)==2)) // if it is a cell we can jump to (diagonal double jump)
                {
                    if (canPawnOrKingMove(notAnyToolCanMoveCheck, x, y, x + xJump, y + yJump))
                    {
                        return true;
                    }
                }
            }
        }
    }

    return false;
}


function canPawnOrKingMoveArray1(xFrom, yFrom, xTo, yTo) {
  if (isLocationInsideBoard(xFrom, yFrom) && isLocationInsideBoard(xTo, yTo)) {
    // check if destination cell is empty
    if (Math.abs(xTo - xFrom) == 1) {
      return isCellEmpty(xTo, yTo); // return true if the cell is really empty for this values
    }

    // if we jump, test if there is a tool of other color within
    if (Math.abs(xTo - xFrom) == 2) {
      if (isCellEmpty(xTo, yTo)) {
        let xMiddle = (xTo + xFrom) / 2;
        let yMiddle = (yTo + yFrom) / 2;
        let myTool = getToolSymbolAt(xFrom, yFrom);
        let toolInTheMiddle = getToolSymbolAt(xMiddle, yMiddle);
        let isJump = false;
        if ((myTool == whitePawnSymbol) || (myTool == whiteKingToolSymbol)) {
          if ((toolInTheMiddle == blackPawnSymbol) || (toolInTheMiddle == blackKingToolSymbol)) {
            isJump = true;
            return [isJump, yMiddle, xMiddle]; // white pawn can eat black pawn or king
          }
        }

        if ((myTool == blackPawnSymbol) || (myTool == blackKingToolSymbol)) {
          if ((toolInTheMiddle == whitePawnSymbol) || (toolInTheMiddle == whiteKingToolSymbol)) {
            isJump = true;
            return [isJump, yMiddle, xMiddle]; // black pawn can eat white pawn or king
          }
        }
      }
    }
  }
  isJump = false;
  return [isJump, 0, 0];
}

    // forced PawnJumpMovement

    function checkForcedWhitePawnJump  () {
      saveXYValues ();
      for (var i=0 ; (i < document.getElementsByClassName("dark").length) && (!isForcedJump) ; i++){
        if ((isWhiteTurn) && (selectedTool[i].getAttribute("src") == whitePawnSymbol)) {
          {
            strOldPositionY = selectedTool[i].id.slice(1, 2);
            strOldPositionX = selectedTool[i].id.slice(2, 3);
            oldPositionY = parseInt(strOldPositionY);
            oldPositionX = parseInt(strOldPositionX);
           checkDownMovementOutOfArray();
          } 
      }
  }
}
  

  function checkForcedBlackPawnJump  () {
    saveXYValues ();
    for (var i=0 ; (i < document.getElementsByClassName("dark").length) && (!isForcedJump) ; i++){
      if ((!isWhiteTurn) && (selectedTool[i].getAttribute("src") == blackPawnSymbol)) {
        {
          strOldPositionY = selectedTool[i].id.slice(1, 2);
          strOldPositionX = selectedTool[i].id.slice(2, 3);
          oldPositionY = parseInt(strOldPositionY);
          oldPositionX = parseInt(strOldPositionX);
         checkUpMovementOutOfArray();
        } 
    }
  }
}



//  check Down Movement (White) forced movement inside board

    function checkUpMovementOutOfArray() {
        let notAnyToolCanMoveCheck = false;
      if (((oldPositionY -2) >=0) && ((oldPositionX -2) >=0))
      {
      newPositionY = oldPositionY -2;
      newPositionX = oldPositionX -2;
       if((canPawnOrKingMove(notAnyToolCanMoveCheck, oldPositionX, oldPositionY, newPositionX, newPositionY)) == true) {
        isForcedJump = true;
       }
      }
    if (((oldPositionY - 2) >=0) && (((oldPositionX) +2) <=7))
      {
      newPositionY = oldPositionY -2;
      newPositionX = parseInt(oldPositionX) +2;
      if((canPawnOrKingMove(notAnyToolCanMoveCheck, oldPositionX, oldPositionY, newPositionX, newPositionY)) == true) {
        isForcedJump = true;
        }
      }
    }

//  check  Up Movement (Black) forced movement inside board

    function checkDownMovementOutOfArray () {
        let notAnyToolCanMoveCheck = false;
      if (((parseInt(oldPositionY) + 2) <=7) && ((parseInt(oldPositionX) +2) <=7))
      {
        newPositionY = parseInt(oldPositionY) + 2;
        newPositionX = parseInt(oldPositionX) + 2;
        if((canPawnOrKingMove(notAnyToolCanMoveCheck, oldPositionX, oldPositionY, newPositionX, newPositionY)) == true) {
        isForcedJump = true;
        } 
      }
    if (((parseInt(oldPositionY) + 2) <=7) && ((oldPositionX -2) >=0))
      {
      newPositionY = parseInt(oldPositionY) + 2;
      newPositionX = oldPositionX -2;
      if((canPawnOrKingMove(notAnyToolCanMoveCheck, oldPositionX, oldPositionY, newPositionX, newPositionY)) == true) {
        isForcedJump = true;
        }
      }
    }

//  save and return original user X,Y values in order to change them

    function saveXYValues () {
      demo = true;
      savedOldPositionY = oldPositionY;
      savedOldPositionX = oldPositionX;
      savedNewPositionY = newPositionY;
      savedNewPositionX = newPositionX;
    }
    function returnSavedXYValues() {
      demo = false;
      oldPositionY = savedOldPositionY;
      oldPositionX = savedOldPositionX;
      newPositionY = savedNewPositionY;
      newPositionX = savedNewPositionX;
    }
  
// ---- Kings Movement----

function checkMovementKings() {
  checkRegularMovementKings();
  if (!isLegalMovement)
    checkJumpKingMovement();
}

//  Check Regular movement of both color Kings

function checkRegularMovementKings() {
  if ((Math.abs(newPositionX - oldPositionX) == 1) && (Math.abs(newPositionY - oldPositionY) == 1) && (event.target.getAttribute("src") == emptyImage)) {
    isLegalMovement = true;
  }
}


function checkJumpKingMovement() {
      var array1 = canPawnOrKingMoveArray1(oldPositionX, oldPositionY, newPositionX, newPositionY);
      if(array1[0] == true) {
        isLegalMovement = true;
        isToolTaken = true;
         if (!demo) {
          isWhiteTurn ?  blackToolsNumber-- : whiteToolsNumber-- ;
          document.getElementById("p2").innerText = "" + (isWhiteTurn ? blackToolsNumber : whiteToolsNumber);
          document.getElementById("a" + array1[1] + array1[2]).setAttribute("src", emptyImage);
       }
     }
}


//   Coronation

function checkCoronation() {
  let tooltoCoronationSymbol = document.getElementById("a" + newPositionY + newPositionX).getAttribute("src");
  if (isWhiteTurn && newPositionY == 7 &&  tooltoCoronationSymbol == whitePawnSymbol) {
    document.getElementById("a" + newPositionY + newPositionX).setAttribute("src", whiteKingToolSymbol);
  }
  if (!isWhiteTurn && newPositionY == 0 &&  tooltoCoronationSymbol == blackPawnSymbol) {
    document.getElementById("a" + newPositionY + newPositionX).setAttribute("src", blackKingToolSymbol);
  }
}


// Taken Tools Count

function checkToolsNumber() {
  if (blackToolsNumber == 0) {
    gameOverDeclaration();
  }
  if (whiteToolsNumber == 0) {
    gameOverDeclaration();
  }
}

// Victory & Game End Declaration

function gameOverDeclaration() {
  isGameOver = true;
  document.getElementById("lastLine").innerText = "  Game Over !  " +
    (isWhiteTurn ? "White Player Won !" : "Black Player Won !");
}


