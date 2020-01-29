

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
let whitePawnSymbol = "\u25CE";
let blackPawnSymbol = "\u25C9";
let whiteKingToolSymbol = "\u2655";
let blackKingToolSymbol = "\u265B";
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

document.getElementById("chessBoard").addEventListener("click", originalLocationEvent);

// event first click

function originalLocationEvent(event) {
  originalLocationId = event.target.id;
  oldPositionY = event.target.id.slice(1, 2);
  oldPositionX = event.target.id.slice(2, 3);
  console.log(oldPositionY);
  console.log(oldPositionX);
  toolSymbol = event.target.innerText;
  if (isWhiteTurn && ((toolSymbol == whitePawnSymbol) || (toolSymbol == whiteKingToolSymbol)) ||
    (!isWhiteTurn && ((toolSymbol == blackPawnSymbol) || (toolSymbol == blackKingToolSymbol)))) {
    removeAllToolSelection();
    event.target.className = event.target.className + " " + "toolSelected";
    document.getElementById("chessBoard").removeEventListener("click", originalLocationEvent);
    document.getElementById("chessBoard").addEventListener("click", destinationEvent);
  }
}

// event second click

function destinationEvent(event) {
  newPositionY = event.target.id.slice(1, 2);
  newPositionX = event.target.id.slice(2, 3);
  console.log(newPositionY);
  console.log(newPositionX);
  changeBooleansToFalse();
  let abc = document.getElementById("a" + oldPositionY + oldPositionX);
  toolSymbol = abc.innerText;
  checkMovement();
  if (isLegalMovement && !(newPositionY === oldPositionY && newPositionX === oldPositionX)) {
    document.getElementById("a" + newPositionY + newPositionX).innerText = toolSymbol;
    document.getElementById("a" + oldPositionY + oldPositionX).innerText = "";
    document.getElementById("chessBoard").removeEventListener("click", destinationEvent);
    checkCoronation();
      if (!canAnyToolMove ()) // if the opponent can not move, this is victory
      {
          gameOverDeclaration();
      }
    cancelAnouncingForcedJump();
    checkToolsNumber();
    checkExtraForcedJumpAndReact();
    if(!isExtraForcedJump) {
    changePlayerTurn();
    document.getElementById("chessBoard").addEventListener("click", originalLocationEvent);
    }
  }
  if (!isLegalMovement && (!isExtraForcedJump)) { // add || demo=true ?
    document.getElementById("chessBoard").removeEventListener("click", destinationEvent);
    document.getElementById("chessBoard").addEventListener("click", originalLocationEvent);
  }
}

// ------------- functions--------------

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

// remove selected tool color

function removeAllToolSelection() {
  let selectedElement = document.getElementsByClassName("toolSelected");
  if (selectedElement.length > 0)
    selectedElement[0].classList.remove("toolSelected");
}

//   Switch Turns

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
  } else if (toolSymbol == whiteKingToolSymbol || toolSymbol == blackKingToolSymbol) {
      checkMovementKings();
      }
      if(!isToolTaken) {
      checkForcedJump ();
      }
}

function checkForcedJump () {
    checkForcedKingsJump();
    returnSavedXYValues();
    if (isWhiteTurn) {
      checkForcedWhitePawnJump();
      returnSavedXYValues();
    }
    if (!isWhiteTurn) {
     checkForcedBlackPawnJump();
     returnSavedXYValues();
    }
    if ((isLegalMovement == true) && (isForcedJump == true) && (!isToolTaken)) {
    isLegalMovement = false;
    announcePlayerForcedJump ();
    changeBooleansToFalse();
  }
}
//  Pawn Movement (& Involved Pawn/king Movement)

function checkRegularMovement() {
  if ((Math.abs(newPositionX - oldPositionX) == 1) && (event.target.innerText == "")) {
    if (isWhiteTurn && (newPositionY - 1 == oldPositionY)) {
      isLegalMovement = true;
    }
    if (!isWhiteTurn && (oldPositionY - 1 == newPositionY)) {
      isLegalMovement = true;
    }
  }
}

function checkJumpWhiteMovement() {
  checkToolInsideJump();
  if ((Math.abs(newPositionX - oldPositionX) == 2) && (newPositionY - 2 == oldPositionY) && (isBlackToolInsideJump) && (event.target.innerText == "")) {
     isLegalMovement = true;
     isToolTaken = true;
      if (!demo) {
        blackToolsNumber--;
        document.getElementById("p2").innerText = "" + blackToolsNumber;
      if (isNewPositionXSmaller) {
         document.getElementById("a" + (parseInt(oldPositionY) + 1) + (oldPositionX - 1)).innerText = "";
       } else {
        document.getElementById("a" + (parseInt(oldPositionY) + 1) + (parseInt(oldPositionX) + 1)).innerText = "";
       }
    }
  }
}

function checkJumpBlackMovement() {
  checkToolInsideJump();
  if ((Math.abs(newPositionX - oldPositionX) == 2) && (oldPositionY - 2 == newPositionY) && (isWhiteToolInsideJump) && (event.target.innerText == "")) {
    isLegalMovement = true;
    isToolTaken = true;
    if (!demo) {
      whiteToolsNumber--;
      document.getElementById("p1").innerText = "" + whiteToolsNumber;
      if (isNewPositionXSmaller) {
        document.getElementById("a" + (oldPositionY - 1) + (oldPositionX - 1)).innerText = "";
      } else {
        document.getElementById("a" + (oldPositionY - 1) + (parseInt(oldPositionX) + 1)).innerText = "";
      }
    }
  }
}

function checkToolInsideJump() {
  idOneInsideJump = document.getElementById("a" + (parseInt(oldPositionY) + 1) + (parseInt(oldPositionX) + 1));
  idTwoInsideJump = document.getElementById("a" + (parseInt(oldPositionY) + 1) + (oldPositionX - 1));
  idThreeInsideJump = document.getElementById("a" + (oldPositionY - 1) + (parseInt(oldPositionX) + 1));
  idFourInsideJump = document.getElementById("a" + (oldPositionY - 1) + (oldPositionX - 1));
  if (toolSymbol == whitePawnSymbol || toolSymbol == whiteKingToolSymbol) {
    checkBlackToolInsideJump();
  }
  if (toolSymbol == blackPawnSymbol || toolSymbol == blackKingToolSymbol) {
    checkWhiteToolInsideJump();
  }
}


function checkBlackToolInsideJump() {
  //if((newPositionX > oldPositionX) && document.getElementById(idOneInsideJump).innerText !== ""  && document.getElementById(idOneInsideJump).innerText !== "\u25CE")
  if ((newPositionX > oldPositionX) && (newPositionY > oldPositionY) && (idOneInsideJump.innerText == blackPawnSymbol || idOneInsideJump.innerText == blackKingToolSymbol)) {
    isBlackToolInsideJump = true;
    isNewPositionXSmaller = false;
    isNewPositionYSmaller = false;
    return;
  }
  //if((newPositionX < oldPositionX) && document.getElementById(idTwoInsideJump).innerText !== ""  && document.getElementById(idTwoInsideJump).innerText !== "\u25CE")
  if ((newPositionX < oldPositionX) && (newPositionY > oldPositionY) && (idTwoInsideJump.innerText == blackPawnSymbol || idTwoInsideJump.innerText == blackKingToolSymbol)) {
    isBlackToolInsideJump = true;
    isNewPositionXSmaller = true;
    isNewPositionYSmaller = false;
  }

  if (toolSymbol == whiteKingToolSymbol && !isBlackToolInsideJump) {
    checkBlackToolInsideReverseJump();
  }
}

function checkWhiteToolInsideJump() {

  if ((newPositionX > oldPositionX) && (newPositionY < oldPositionY) && (idThreeInsideJump.innerText == whitePawnSymbol || idThreeInsideJump.innerText == whiteKingToolSymbol)) {
    isWhiteToolInsideJump = true;
    isNewPositionXSmaller = false;
    isNewPositionYSmaller = true;
  }
  if ((newPositionX < oldPositionX) && (newPositionY < oldPositionY) && (idFourInsideJump.innerText == whitePawnSymbol || idFourInsideJump.innerText == whiteKingToolSymbol)) {
    isWhiteToolInsideJump = true;
    isNewPositionXSmaller = true;
    isNewPositionYSmaller = true;
  }
  if (toolSymbol == blackKingToolSymbol && !isWhiteToolInsideJump) {
    checkWhiteToolInsideReverseJump();
  }
}

//  Forced Jump movement Kings

function checkForcedKingsJump  () {
  saveXYValues ();
  for (var i=0 ; (i < document.getElementsByClassName("dark").length) && (!isForcedJump) ; i++){
     if (((isWhiteTurn) && (selectedTool[i].innerText == whiteKingToolSymbol)) || ((!isWhiteTurn) && (selectedTool[i].innerText == blackKingToolSymbol)))
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

function canAnyToolMove()
{
    let toolSymbol;

    for (var x = 0; x <=7; x++)
    {
        for (var y = 0; y <=7; y++)
        {
            toolSymbol = getToolSymbolAt(x, y);

            if ((!isWhiteTurn && ((toolSymbol == whiteKingToolSymbol) || (toolSymbol == whitePawnSymbol))) ||
               (( isWhiteTurn && ((toolSymbol == blackKingToolSymbol) || (toolSymbol == blackPawnSymbol)))))
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
    let toolSymbol = toolAtCell.innerText;
    return toolSymbol;
}

// Check if the cell/square is is Empty

function isCellEmpty(x, y)
{
    let toolSymbol = getToolSymbolAt(x, y);
    if (toolSymbol == "")
    {
        return true;
    }
    return false;
}

function canToolMove(x, y)
{
    let xTo, yTo;
    let MovementDirection = 1;
    let toolSymbol = getToolSymbolAt(x, y);

    if ((toolSymbol == blackPawnSymbol) || (toolSymbol == whitePawnSymbol))
    {
        if (toolSymbol == blackPawnSymbol)
            MovementDirection = -1; // black moves up

        // loop all four places the pawn can move
        if (canPawnOrKingMove(x, y, x + 1, (y + MovementDirection)) == true)
            return true;

        if (canPawnOrKingMove(x, y, x - 1, (y + MovementDirection)) == true)
            return true;

        if (canPawnOrKingMove(x, y, x + 2, y + (2 * MovementDirection)) == true)
            return true;

        if (canPawnOrKingMove(x, y, x - 2, y + (2 * MovementDirection)) == true)
            return true;
    }

    if ((toolSymbol == blackKingToolSymbol) || (toolSymbol == whiteKingToolSymbol))
    {
        // loop all cells the king can move to
        for (var xJump = -2; xJump <= 2; xJump++)
        {
            for (var yJump = -2; xJump <= 2; yJump++)
            {
                if ((xJump != 0) && (yJump != 0) && (Math.abs(xJump) == Math.abs(yJump))) // if it is a cell we can jump to (diagonal jump)
                {
                    if (canPawnOrKingMove(x, y, x + xJump, y + yJump))
                    {
                        return true;
                    }
                }
            }
        }
    }

    return false;
}


 // check if a pawn or king can move from (xFrom, yFrom) to (xTo, yTo)
 // (disregarding tool direction)

function canPawnOrKingMove(xFrom, yFrom, xTo, yTo)
{
    if (isLocationInsideBoard (xFrom, yFrom) && isLocationInsideBoard(xTo, yTo))
    {
        // check if destination cell is empty
        if (Math.abs(xTo - xFrom) == 1)
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
    
    function cancelAnouncingForcedJump() {
      document.getElementById("lastLine").innerText = " ";
    }

  //  ----functions for forced Jump movement---

// Extra forced jump

function checkExtraForcedJumpAndReact(){
  if(ExtraForcedJump(parseInt(newPositionX), parseInt(newPositionY))) {
    oldPositionY = newPositionY;
    oldPositionX = newPositionX;
    abc.className = abc.className + " " + "toolSelected";
    isExtraForcedJump = true;
    announcePlayerForcedJump ();
    document.getElementById("chessBoard").addEventListener("click", destinationEvent); 
  }
}


function ExtraForcedJump(x, y)
{
    let xTo, yTo;
    let MovementDirection = 1;
    let toolSymbol = getToolSymbolAt(newPositionX, newPositionY);

    if ((toolSymbol == blackPawnSymbol) || (toolSymbol == whitePawnSymbol))
    {
        if (toolSymbol == blackPawnSymbol)
            MovementDirection = -1; // black moves up, Y number is getting smaller

        // loop two directions the pawn can jump

        if (canPawnOrKingJump(x, y, x + 2, y + (2 * MovementDirection)) == true)
            return true;

        if (canPawnOrKingJump(x, y, x - 2, y + (2 * MovementDirection)) == true)
            return true;
    }

    if ((toolSymbol == blackKingToolSymbol) || (toolSymbol == whiteKingToolSymbol))
    {
        // loop all cells the king can move to
        for (var xJump = -2; xJump <= 2; xJump++)
        {
            for (var yJump = -2; xJump <= 2; yJump++)
            {
                if ((xJump != 0) && (yJump != 0) && (Math.abs(xJump) == Math.abs(yJump)) && (Math.abs(xJump)==2)) // if it is a cell we can jump to (diagonal double jump)
                {
                    if (canPawnOrKingJump(x, y, x + xJump, y + yJump))
                    {
                        return true;
                    }
                }
            }
        }
    }

    return false;
}


// check if a pawn or king can move from (xFrom, yFrom) to (xTo, yTo)
// (disregarding tool direction)

function canPawnOrKingJump(xFrom, yFrom, xTo, yTo)
{
   if (isLocationInsideBoard (xFrom, yFrom) && isLocationInsideBoard(xTo, yTo))
   {
       // check if destination cell is empty

       // if we jump, test if there is a tool of other color within
       if (Math.abs(xTo - xFrom) == 2)
       {
           if (isCellEmpty(xTo, yTo))        // check if destination cell is empty
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

    // forced PawnJumpMovement

    function checkForcedWhitePawnJump  () {
      saveXYValues ();
      for (var i=0 ; (i < document.getElementsByClassName("dark").length) && (!isForcedJump) ; i++){
         if ((isWhiteTurn) && (selectedTool[i].innerText == whitePawnSymbol)) 
          {
            strOldPositionY = selectedTool[i].id.slice(1, 2);
            strOldPositionX = selectedTool[i].id.slice(2, 3);
            oldPositionY = parseInt(strOldPositionY);
            oldPositionX = parseInt(strOldPositionX);
           checkDownMovementOutOfArray();
          } 
      }
  }
  

  function checkForcedBlackPawnJump  () {
    saveXYValues ();
    for (var i=0 ; (i < document.getElementsByClassName("dark").length) && (!isForcedJump) ; i++){
       if ((!isWhiteTurn) && (selectedTool[i].innerText == blackPawnSymbol)) 
        {
          strOldPositionY = selectedTool[i].id.slice(1, 2);
          strOldPositionX = selectedTool[i].id.slice(2, 3);
          oldPositionY = parseInt(strOldPositionY);
          oldPositionX = parseInt(strOldPositionX);
         checkUpMovementOutOfArray();
        } 
    }
  }


  function checkForcedKingsJumpAfterVariableDefined() {
    toolSymbol = document.getElementById("a" + oldPositionY + oldPositionX).innerText;
    if (document.getElementById("a" + newPositionY + newPositionX).innerText == "")
      {
        if (isWhiteTurn && (toolSymbol == whiteKingToolSymbol || toolSymbol == whitePawnSymbol))
           {
            checkToolInsideJump();
            if (isBlackToolInsideJump)
               {
               isForcedJump = true;
               }
           }
        if (!isWhiteTurn  && (toolSymbol == blackKingToolSymbol || toolSymbol == blackPawnSymbol))
        {
          checkToolInsideJump();
          if (isWhiteToolInsideJump)
             {
             isForcedJump = true;
             }
         }
    }
  }

//  check Down Movement (White) forced movement inside board

    function checkUpMovementOutOfArray() {
      if (((oldPositionY -2) >=0) && ((oldPositionX -2) >=0))
      {
      newPositionY = oldPositionY -2;
      newPositionX = oldPositionX -2;
      checkForcedKingsJumpAfterVariableDefined();
      }
    if (((oldPositionY - 2) >=0) && ((oldPositionX +2) <=7))
      {
      newPositionY = oldPositionY -2;
      newPositionX = oldPositionX +2;
      checkForcedKingsJumpAfterVariableDefined();
      }
    }

//  check  Up Movement (Black) forced movement inside board

    function checkDownMovementOutOfArray () {
      if (((parseInt(oldPositionY) + 2) <=7) && ((parseInt(oldPositionX) +2) <=7))
      {
      newPositionY = oldPositionY +2;
      newPositionX = oldPositionX +2;
      checkForcedKingsJumpAfterVariableDefined();
      }
    if (((oldPositionY + 2) <=7) && ((oldPositionX -2) >=0))
      {
      newPositionY = oldPositionY +2;
      newPositionX = oldPositionX -2;
      checkForcedKingsJumpAfterVariableDefined();
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
  if ((Math.abs(newPositionX - oldPositionX) == 1) && (Math.abs(newPositionY - oldPositionY) == 1) && (event.target.innerText == "")) {
    isLegalMovement = true;
  }
}

//  Check Jump movement of both color Kings

function checkJumpKingMovement() {
  checkToolInsideJump();
  if ((isWhiteTurn && isBlackToolInsideJump) || (!isWhiteTurn && isWhiteToolInsideJump)) {
    if ((Math.abs(newPositionX - oldPositionX) == 2) && (Math.abs(newPositionY - oldPositionY) == 2)) {
      isLegalMovement = true;
      isToolTaken = true;
      if (!demo) {
        if (isWhiteTurn){
          blackToolsNumber--;
          document.getElementById("p2").innerText = "" + blackToolsNumber;
        }
        if (!isWhiteTurn) {
          whiteToolsNumber--;
          document.getElementById("p1").innerText = "" + whiteToolsNumber;
        }
        eatToolClearCell();
      }
    }
  }
}

// Clear the taken tool, both colors

function eatToolClearCell() {
  if (isNewPositionXSmaller && !isNewPositionYSmaller) {
    document.getElementById("a" + (parseInt(oldPositionY) + 1) + (oldPositionX - 1)).innerText = "";
  }
  if (!isNewPositionXSmaller && !isNewPositionYSmaller) {
    document.getElementById("a" + (parseInt(oldPositionY) + 1) + (parseInt(oldPositionX) + 1)).innerText = "";
  }
  if (isNewPositionXSmaller && isNewPositionYSmaller) {
    document.getElementById("a" + (oldPositionY - 1) + (oldPositionX - 1)).innerText = "";
  }
  if (!isNewPositionXSmaller && isNewPositionYSmaller) {
    document.getElementById("a" + (oldPositionY - 1) + (parseInt(oldPositionX) + 1)).innerText = "";
  }
}

// Check if Black tool in the middle of Reverse Jump by Black King

function checkBlackToolInsideReverseJump() {
  if ((newPositionX > oldPositionX) && (newPositionY < oldPositionY) && (idThreeInsideJump.innerText == blackPawnSymbol || idThreeInsideJump.innerText == blackKingToolSymbol)) {
    isBlackToolInsideJump = true;
    isNewPositionXSmaller = false;
    isNewPositionYSmaller = true;
  }
  if ((newPositionX < oldPositionX) && (newPositionY < oldPositionY) && (idFourInsideJump.innerText == blackPawnSymbol || idFourInsideJump.innerText == blackKingToolSymbol)) {
    isBlackToolInsideJump = true;
    isNewPositionXSmaller = true;
    isNewPositionYSmaller = true;
  }
}

// Check if Black tool in the middle of Reverse Jump by White King

function checkWhiteToolInsideReverseJump() {
  if ((newPositionX > oldPositionX) && (newPositionY > oldPositionY) && (idOneInsideJump.innerText == whitePawnSymbol || idOneInsideJump.innerText == whiteKingToolSymbol)) {
    isWhiteToolInsideJump = true;
    isNewPositionXSmaller = false;
    isNewPositionYSmaller = false;
  }
  if ((newPositionX < oldPositionX) && (newPositionY > oldPositionY) && (idTwoInsideJump.innerText == whitePawnSymbol || idTwoInsideJump.innerText == whiteKingToolSymbol)) {
    isWhiteToolInsideJump = true;
    isNewPositionXSmaller = true;
    isNewPositionYSmaller = false;
  }
}

//   Coronation

function checkCoronation() {
  if (isWhiteTurn && newPositionY == 7) {
    document.getElementById("a" + newPositionY + newPositionX).innerText = whiteKingToolSymbol;
  }
  if (!isWhiteTurn && newPositionY == 0) {
    document.getElementById("a" + newPositionY + newPositionX).innerText = blackKingToolSymbol;
  }
}


// Taken Tools Count

function checkToolsNumber() {
  if (isWhiteTurn)
    checkWhiteToolsNumber();
  else
    checkBlackToolsNumber();
}

function checkBlackToolsNumber() {
  if (blackToolsNumber == 0) {
    isGameOver = true;
    isWhiteWon = true;
    gameOverDeclaration();
  }
}

function checkWhiteToolsNumber() {
  if (whiteToolsNumber == 0) {
    isGameOver = true;
    isBlackWon = true;
    gameOverDeclaration();
  }
}

// Victory & Game End Declaration

function gameOverDeclaration() {
  document.getElementById("lastLine").innerText = "  Game Over !  " +
    (isWhiteWon ? "White Player Won !" : "Black Player Won !");
}
