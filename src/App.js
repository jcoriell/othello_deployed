/*
Joshua Coriell
Tuesday, Novemeber 12
CWID: 101-75-228
Assignment #3 - Othello

Description:
This program implements Othello. You can play with two humans, or a human can play against an AI.
*/



import React from 'react';
import './App.css';
import { Row, Container, Col, Form, Button } from 'react-bootstrap';
import Tile from './components/Tile';
import DebugTile from './components/DebugTile'

var black = 1;
var white = 2;
const available = 8;
const blank = 0;
var possibleMoves = [];
var prunes = [];

class App extends React.Component{
  constructor(){
    super()
    this.state = {
      // 8 means valid move for current player, 1 is black, 2 white
      gameState : [[0,0,0,0,0,0,0,0],
                   [0,0,0,0,0,0,0,0],
                   [0,0,0,available,0,0,0,0],
                   [0,0,available,white,black,0,0,0],
                   [0,0,0,black,white,available,0,0],
                   [0,0,0,0,available,0,0,0],
                   [0,0,0,0,0,0,0,0],
                   [0,0,0,0,0,0,0,0],],
      gameStateTranspose : [[0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0],
                            [0,0,0,available,0,0,0,0],
                            [0,0,available,white,black,0,0,0],
                            [0,0,0,black,white,available,0,0],
                            [0,0,0,0,available,0,0,0],
                            [0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0],],
      activePlayer : black,
      inactivePlayer : white,
      blackPoints: 2,
      whitePoints: 2,
      availablePoints: 4,
      gameMode: 'menu',
      humanIsBlack: true,
      debugBoards: [],
      debugMode: false,
      pruning: false,
      aiDepth: 3,
      moves3: [],
      moves2: [],
      moves1: []
    }
    this.setPlayer = this.setPlayer.bind(this);
    this.handleGameState = this.handleGameState.bind(this);
    this.checkTileOnRight = this.checkTileOnRight.bind(this);
    this.checkTileOnLeft = this.checkTileOnLeft.bind(this);
    this.checkTileAbove = this.checkTileAbove.bind(this);
    this.checkTileBelow = this.checkTileBelow.bind(this);
    this.checkNorthEast = this.checkNorthEast.bind(this);
    this.checkNorthWest = this.checkNorthWest.bind(this);
    this.checkSouthEast = this.checkSouthEast.bind(this);
    this.checkSouthWest = this.checkSouthWest.bind(this);
    this.updateScore = this.updateScore.bind(this);
    this.handleGameMode = this.handleGameMode.bind(this);
    this.handleAI = this.handleAI.bind(this);
    this.checkForWin = this.checkForWin.bind(this);
    this.bestPlay = this.bestPlay.bind(this);
    this.minimax = this.minimax.bind(this);
    this.updateState = this.updateState.bind(this);
    this.createGameBoard = this.createGameBoard.bind(this);
    this.toggleColor = this.toggleColor.bind(this);
    this.createDebugBoard = this.createDebugBoard.bind(this);
    this.toggleDebug = this.toggleDebug.bind(this)
    this.alphabetaprune = this.alphabetaprune.bind(this);
    this.togglePruning = this.togglePruning.bind(this);
    this.handleDepth = this.handleDepth.bind(this);
    this.handleDebugDepth = this.handleDebugDepth.bind(this);
  }


  createDebugBoard(gameInfo){
  
    let result = gameInfo.gameState.map((i, rowIndex) => {
    
      return(
          <Row className = 'myrow' key = {rowIndex}>
            {i.map((j, colIndex) => {
              return(
                <DebugTile 
                  key = {colIndex}
                  tileValue = {j} 
                  humanIsBlack = {this.state.humanIsBlack}
                  available = {available}
                  />
              )
              })
            }
          </Row>
        )
      })

      return result
 
  }



  handleAI(gameInfo){
    console.log('ai has been handled')
    let coordinates = this.bestPlay(gameInfo)
    let newGameState = this.handleGameState(coordinates.row, coordinates.col, gameInfo.activePlayer, gameInfo.gameState, gameInfo.gameStateTranspose)
    this.updateState(newGameState.gameState, newGameState.gameStateTranspose, newGameState.activePlayer)
  }

  handleGameMode(mode){
    this.setState({gameMode: mode})
  }

  updateScore(gameState){
    let blackScore = 0;
    let whiteScore = 0;
    let availableSpots = 0;
    for (let i = 0; i < gameState.length; i++){
      for (let j = 0; j < gameState[i].length; j++){
        if (gameState[i][j] === black){blackScore++;}
        if (gameState[i][j] === white){whiteScore++;}
        if (gameState[i][j] === available){availableSpots++}
      }
    }


    let result = {blackPoints: blackScore, whitePoints: whiteScore, availablePoints: availableSpots}
    return result
  }

  checkForWin(blackScore, whiteScore, availableSpots){
      let winning = null;
        if (blackScore > whiteScore){
          winning = 'Black';
        }
        if (whiteScore > blackScore){
          winning = 'White';
        }
        if (blackScore === whiteScore){
          winning = 'tie';
        }
        if (blackScore + whiteScore === 64 || availableSpots === 0){
          this.handleGameMode('gameover')
        }
      return winning;
  }

  bestPlay(gameInfo){
    /*
    let inputRow;
    let inputCol;
    loop:
    for (let i = 0; i < gameState.length; i++){
      for (let j = 0; j < gameState[i].length; j++){
        if(gameState[i][j] === available){
          inputRow = i;
          inputCol = j;
          console.log('Best Play was at (Row = ' + inputRow + ', Col = ' + inputCol +')')
          break loop;
        }
      }
    }
    let coordinates = {row: inputRow, col: inputCol};
    */
   possibleMoves = [];
   prunes = []
   let coordinates;
   let depth = this.state.aiDepth;
   this.setState({debugDepth: this.state.aiDepth})
   if (this.state.pruning){
    let alpha = -10000
    let beta = 10000
    
    let result = this.alphabetaprune(gameInfo, gameInfo.activePlayer, depth, alpha, beta)
    console.log(result)
    coordinates = {row: result.row, col: result.col}
   }

   else { 
    let result = this.minimax(gameInfo, gameInfo.activePlayer, depth)
    console.log(result)
    coordinates = {row: result.row, col: result.col}
   }

    return coordinates;
    
  }

  alphabetaprune(gameInfo, player, depth, alpha, beta) {
    let newGameState = gameInfo.gameState;
    let newGameStateTranspose = gameInfo.gameStateTranspose;
    // find the row and column of available spots to play in the incoming gamestate
    let availables = [];
    

    for (let i = 0; i < newGameState.length; i++){
      for (let j = 0; j < newGameState[i].length; j++){
        if (newGameState[i][j] === available){
          availables.push({row: i, col: j})
        }
      }
    }

    let nodeScore = this.updateScore(newGameState)
    let heuristic = 100 * (nodeScore.whitePoints - nodeScore.blackPoints) / (nodeScore.whitePoints + nodeScore.blackPoints)
    possibleMoves.push({board: this.createDebugBoard(gameInfo), depth: depth, score: heuristic})

    // check if you are at max depth.
    if (depth === 0){
      // if you are at max depth return the score of that node.
     /* if (player === black){
        let heuristic = 100 * (nodeScore.blackPoints - nodeScore.whitePoints) / (nodeScore.blackPoints + nodeScore.whitePoints)
        return {score: heuristic}
      }
      if (player === white){*/
        let heuristic = 100 * (nodeScore.whitePoints - nodeScore.blackPoints) / (nodeScore.whitePoints + nodeScore.blackPoints)
        return {score: heuristic}
      //}
          
    }
    else if (availables.length === 0){
      return {score: 100}
    }
    
    // create something that can store the scores for each move that is made (an array called moveScores = []). these will be evaluated later.
    let moves = [];
    // start a loop that runs through the available spots to play.
    for (let i = 0; i < availables.length; i++){
        // at the beginning of the loop, create an object that stores the row of the move, the col of the move, and the score that results from that move.
        let move = {};
        // set the row of the move object to row of the ith item in the array of available spots to play
        // set the col of the move object to the col of the ith item in the array of available spots ot play
        ///something might not be right here?????
        move.value = newGameState[availables[i].row][availables[i].col]
        move.row = availables[i].row;
        move.col = availables[i].col;
        move.breadth = i;
        
        
        let tiles = [];
        for (let j = 0; j < newGameState.length; j++){
          for (let k = 0; k < newGameState[j].length; k++){
            tiles.push({row: j, col: k, value: newGameState[j][k]})
          }
        }
 
      
       
        //simiulate a play by the current player
        let result = this.handleGameState(availables[i].row, availables[i].col, player, newGameState, newGameStateTranspose)
        let pruneBoard = this.createDebugBoard(result)

        // if the player is the (ai) white player, 
        if (player === white){
          //then store the result of calling minimax on the newGameState with the black player and one more level of depth
          let minimaxResult = this.alphabetaprune(result, black, depth - 1, alpha, beta)
          //also set the score of the move object to the score of the result of calling that minimax algorithm
          move.score = minimaxResult.score

          // set the board back to how it was if the play never happened. 
          for (let j = 0; j < tiles.length; j++){
            newGameState[tiles[j].row][tiles[j].col] = tiles[j].value
            newGameStateTranspose[tiles[j].col][tiles[j].row] = tiles[j].value
          }
          moves.push(move)
          /// compare alpha to move.score and set alpha to whichever is larger
          if (alpha < move.score){
            alpha = move.score
          }
          /// if beta is less than alpha at this point, break out of the parent for loop
          if (beta <= alpha){
            prunes.push({depth: depth, breadth: move.breadth, board: pruneBoard})
            break
          }
        }
        // else, when it is not the AI's turn...
        else {
          //then store the result of calling minimax on the newGameState with the white player and one more level of depth
          let minimaxResult = this.alphabetaprune(result, white, depth - 1, alpha, beta)
          //also set the score of the move object to the score of the result of calling that minimax algorithm
          move.score = minimaxResult.score

          // set the board back to how it was if the play never happened. 
          for (let j = 0; j < tiles.length; j++){
            newGameState[tiles[j].row][tiles[j].col] = tiles[j].value
            newGameStateTranspose[tiles[j].col][tiles[j].row] = tiles[j].value
          }

          // moves.push(move) will add the score to the moves array for this iteration.
          moves.push(move)

          // compare beta to move.score and set beta to whichever is smaller.
          if (beta > move.score){
            beta = move.score
          }
          // if beta is less than alpha at this point, break out of the parent for loop
          if (beta <= alpha){
            prunes.push({depth: depth, breadth: move.breadth, board: pruneBoard})
            break
          }
        }
        // set the board back to how it was if the play never happened.    

      
        // moves.push(move) will add the score to the moves array for this iteration.
        //moves.push(move)
    }
    // determine the best move to make.
    let bestMove;
    // if the player is white...
    if (player === white){
      let bestScore = -10000;
      // loop through the moves array (all the scores). 
      for (let i = 0; i < moves.length; i++){
        // if the score of the ith item is larger than the bestScore variable:
        if (moves[i].score > bestScore){
          // set bestScore to the score of that move.
          bestScore = moves[i].score
          // set bestMove = index of moves array
          bestMove = i;
        }
      }
    }
    // if the player is black, chose the lowest score.
    else {
      // create a variable called bestScore and set it to a really large number (10000)
      let bestScore = 10000;
      for (let i = 0; i < moves.length; i++){
        // if the score of the ith item is less than the bestScore variable:
        if (moves[i].score < bestScore){
          // set bestScore to the score of that move.
          bestScore = moves[i].score
          // set bestMove = index of moves array
          bestMove = i;
        }
      }
    }
    
    return moves[bestMove];
  }
  





  minimax(gameInfo, player, depth) {
    let newGameState = gameInfo.gameState;
    let newGameStateTranspose = gameInfo.gameStateTranspose;
    // find the row and column of available spots to play in the incoming gamestate
    let availables = [];
    
    for (let i = 0; i < newGameState.length; i++){
      for (let j = 0; j < newGameState[i].length; j++){
        if (newGameState[i][j] === available){
          availables.push({row: i, col: j})
        }
      }
    }

    let nodeScore = this.updateScore(newGameState)
    let heuristic = 100 * (nodeScore.whitePoints - nodeScore.blackPoints) / (nodeScore.whitePoints + nodeScore.blackPoints)
    if (availables.length === 0 && nodeScore.whitePoints > nodeScore.blackPoints){
      heuristic = 100
    }
    else if (availables.length === 0 && nodeScore.blackPoints > nodeScore.whitePoints){
      heuristic = -100
    }
    else if (availables.length === 0){
      heuristic = 0
    }

    // check if you are at max depth.
    possibleMoves.push({board: this.createDebugBoard(gameInfo), depth: depth, score: heuristic})
    if (depth === 0){
      // if you are at max depth return the score of that node.
     /* if (player === black){
        let heuristic = 100 * (nodeScore.blackPoints - nodeScore.whitePoints) / (nodeScore.blackPoints + nodeScore.whitePoints)
        return {score: heuristic}
      }
      if (player === white){*/
        return {score: heuristic}
      //}
          
    }
    else if (availables.length === 0){

        return {score: heuristic}
    
    }
    
    
    // create something that can store the scores for each move that is made (an array called moveScores = []). these will be evaluated later.
    let moves = [];
    // start a loop that runs through the available spots to play.
    for (let i = 0; i < availables.length; i++){
        // at the beginning of the loop, create an object that stores the row of the move, the col of the move, and the score that results from that move.
        let move = {};
        // set the row of the move object to row of the ith item in the array of available spots to play
        // set the col of the move object to the col of the ith item in the array of available spots ot play
        ///something might not be right here?????
        move.value = newGameState[availables[i].row][availables[i].col]
        move.row = availables[i].row;
        move.col = availables[i].col;
        
        let tiles = [];
        for (let j = 0; j < newGameState.length; j++){
          for (let k = 0; k < newGameState[j].length; k++){
            tiles.push({row: j, col: k, value: newGameState[j][k]})
          }
        }
 
      
       
        //simiulate a play by the current player
        let result = this.handleGameState(availables[i].row, availables[i].col, player, newGameState, newGameStateTranspose)
        move.board = this.createDebugBoard(result)
        move.breadth = i

        

        // if the player is the (ai) white player, 
        if (player === white){
          //then store the result of calling minimax on the newGameState with the black player and one more level of depth
          let minimaxResult = this.minimax(result, black, depth - 1)
          //also set the score of the move object to the score of the result of calling that minimax algorithm
          move.score = minimaxResult.score

          // set the board back to how it was if the play never happened. 
          for (let j = 0; j < tiles.length; j++){
            newGameState[tiles[j].row][tiles[j].col] = tiles[j].value
            newGameStateTranspose[tiles[j].col][tiles[j].row] = tiles[j].value
          }
          
          moves.push(move)
          /// compare alpha to move.score and set alpha to whichever is larger

        }
        // else, when it is not the AI's turn...
        else {
          //then store the result of calling minimax on the newGameState with the white player and one more level of depth
          let minimaxResult = this.minimax(result, white, depth - 1)
          //also set the score of the move object to the score of the result of calling that minimax algorithm
          move.score = minimaxResult.score

          // set the board back to how it was if the play never happened. 
          for (let j = 0; j < tiles.length; j++){
            newGameState[tiles[j].row][tiles[j].col] = tiles[j].value
            newGameStateTranspose[tiles[j].col][tiles[j].row] = tiles[j].value
          }

          // moves.push(move) will add the score to the moves array for this iteration.
          
          moves.push(move)

          // compare beta to move.score and set beta to whichever is smaller.
        }
        // set the board back to how it was if the play never happened.    

      
        // moves.push(move) will add the score to the moves array for this iteration.
        //moves.push(move)
    }
    // determine the best move to make.
    let bestMove;
    // if the player is white...
    if (player === white){
      let bestScore = -10000;
      // loop through the moves array (all the scores). 
      for (let i = 0; i < moves.length; i++){
        // if the score of the ith item is larger than the bestScore variable:
        if (moves[i].score > bestScore){
          // set bestScore to the score of that move.
          bestScore = moves[i].score
          // set bestMove = index of moves array
          bestMove = i;
        }
      }
    }
    // if the player is black, chose the lowest score.
    else {
      // create a variable called bestScore and set it to a really large number (10000)
      let bestScore = 10000;
      for (let i = 0; i < moves.length; i++){
        // if the score of the ith item is less than the bestScore variable:
        if (moves[i].score < bestScore){
          // set bestScore to the score of that move.
          bestScore = moves[i].score
          // set bestMove = index of moves array
          bestMove = i;
        }
      }
    }
    /*
  
    let key = 'moves' + depth
    
    if (key === 'moves3'){
      this.setState({[key]: [...this.state.moves3, moves]})
    }
    if (key === 'moves2'){
      this.setState({[key]: [...this.state.moves2, moves]})
    }
    if (key === 'moves1'){
      this.setState({[key]: [...this.state.moves1, moves]})
    }*/
    return moves[bestMove];
    
  }
  

  checkTileOnRight(rowIndex, colIndex, activePlayer, tempGameState){
    let inactivePlayer = (activePlayer === black ? white : black)
    // if you're on the edge, don't check the next tile.
    if (colIndex === 7){return false}
    // if you're not on the edge, see if the tile on the right is the same color as the person who just played and if the upcoming player has a piece in this row, return true.
    else {
      let tilesOnRightFromMeToRight = [];
      let i = rowIndex;
      let j = colIndex + 1;
      while (j <= 7){
        let result;
        if (tempGameState[i][j] === available){result = blank}
        else{result = tempGameState[i][j]}
        tilesOnRightFromMeToRight.push(result);
        j++;
      } 
      let tileOnRightIsActivePlayer = (tilesOnRightFromMeToRight[0] === activePlayer ? true : false)
      let firstInactivePlayerIndex = tilesOnRightFromMeToRight.indexOf(inactivePlayer)
      if (firstInactivePlayerIndex === -1){return false}
      let firstBlankIndex = tilesOnRightFromMeToRight.indexOf(blank)
      if (firstBlankIndex === -1 ){firstBlankIndex = 20}
      let inactivePlayerComesBeforeBlank = (firstInactivePlayerIndex < firstBlankIndex ? true : false)
      let inactivePlayerExistsInTilesOnRight = (firstInactivePlayerIndex !== -1 ? true : false)
      if (tileOnRightIsActivePlayer && inactivePlayerExistsInTilesOnRight && inactivePlayerComesBeforeBlank){
        return true
      }
      else{return false}

  }
}

  checkTileOnLeft(rowIndex, colIndex, activePlayer, tempGameState){
    let inactivePlayer = (activePlayer === black ? white : black)
    // if you're on the edge, don't check the previous tile.
    if (colIndex === 0){return false}
    else{
      let tilesOnLeftFromMeToLeft = [];
      let i = rowIndex;
      let j = colIndex - 1;
      while (j >= 0){
        let result;
        if (tempGameState[i][j] === available){result = blank}
        else{result = tempGameState[i][j]}
        tilesOnLeftFromMeToLeft.push(result);
        j--;
      } 
      let tileOnLeftIsActivePlayer = (tilesOnLeftFromMeToLeft[0] === activePlayer ? true : false)
      let firstInactivePlayerIndex = tilesOnLeftFromMeToLeft.indexOf(inactivePlayer)
      if (firstInactivePlayerIndex === -1){return false}
      let firstBlankIndex = tilesOnLeftFromMeToLeft.indexOf(blank)
      if (firstBlankIndex === -1 ){firstBlankIndex = 20}
      let inactivePlayerComesBeforeBlank = (firstInactivePlayerIndex < firstBlankIndex ? true : false)
      let inactivePlayerExistsInTilesOnLeft = (firstInactivePlayerIndex !== -1 ? true : false)
      if (tileOnLeftIsActivePlayer && inactivePlayerExistsInTilesOnLeft && inactivePlayerComesBeforeBlank){
        return true
      }
      else{return false}

    }
 
  
  }

  checkTileAbove(rowIndex, colIndex, activePlayer, tempGameStateTranspose){
    let inactivePlayer = (activePlayer === black ? white : black)
    // if you're on the edge, don't check above.
    if (rowIndex === 0){return false}
    else{
      let tilesAboveFromMeToTop = tempGameStateTranspose[colIndex].slice(0, rowIndex).reverse()  //creates an array of the tile on the right of the current one.
      let tileAboveIsActivePlayer = (tilesAboveFromMeToTop[0] === activePlayer ? true : false)
      let firstInactivePlayerIndex = tilesAboveFromMeToTop.indexOf(inactivePlayer)
      let firstBlankIndex = tilesAboveFromMeToTop.indexOf(blank)
      if (firstBlankIndex === -1 ){firstBlankIndex = 20}
      if (firstInactivePlayerIndex === -1){return false}
      let inactivePlayerExistsInTilesAbove = (firstInactivePlayerIndex !== -1 ? true : false)
      let inactivePlayerComesBeforeBlank = (firstInactivePlayerIndex < firstBlankIndex ? true : false)
      if (tileAboveIsActivePlayer && inactivePlayerExistsInTilesAbove && inactivePlayerComesBeforeBlank){
        return true
      }
      else{return false}


    }
  }

  checkTileBelow(rowIndex, colIndex, activePlayer, tempGameStateTranspose){
    let inactivePlayer = (activePlayer === black ? white : black)
    // if you're on the edge, don't check above.
    if (rowIndex === 7){return false}
    else{
      let tilesBelowFromMeToBottom = tempGameStateTranspose[colIndex].slice(rowIndex + 1)
      let tileBelowIsActivePlayer = (tilesBelowFromMeToBottom[0] === activePlayer ? true : false)
      let firstInactivePlayerIndex = tilesBelowFromMeToBottom.indexOf(inactivePlayer)
      let firstBlankIndex = tilesBelowFromMeToBottom.indexOf(blank)
      if (firstBlankIndex === -1 ){firstBlankIndex = 20}
      if (firstInactivePlayerIndex === -1){return false}
      let inactivePlayerExistsInTilesBelow = (firstInactivePlayerIndex !== -1 ? true : false)
      let inactivePlayerComesBeforeBlank = (firstInactivePlayerIndex < firstBlankIndex ? true : false)
      if (tileBelowIsActivePlayer && inactivePlayerExistsInTilesBelow && inactivePlayerComesBeforeBlank){
        return true
      }
      else{return false}
      
    }
  }


  checkNorthEast(rowIndex, colIndex, activePlayer, tempGameState){
    let inactivePlayer = (activePlayer === black ? white : black)
    if (rowIndex ===  0 || colIndex === 7){return false}
    else{
      let tilesFromMeToNorthEast = [];
      let i = rowIndex - 1;
      let j = colIndex + 1;
      while (i >= 0 && j <= 7){
        let result;
        if (tempGameState[i][j] === available){result = blank}
        else{result = tempGameState[i][j]}
        tilesFromMeToNorthEast.push(result);
        i--;
        j++;
      }
      let tileNorthEastIsActivePlayer = (tilesFromMeToNorthEast[0] === activePlayer ? true : false)
      let firstInactivePlayerIndex = tilesFromMeToNorthEast.indexOf(inactivePlayer)
      let firstBlankIndex = tilesFromMeToNorthEast.indexOf(blank)
      if (firstBlankIndex === -1 ){firstBlankIndex = 20}
      if (firstInactivePlayerIndex === -1){return false}
      let inactivePlayerExistsInNorthEastTiles = (firstInactivePlayerIndex !== -1 ? true : false)
      let inactivePlayerComesBeforeBlank = (firstInactivePlayerIndex < firstBlankIndex ? true : false)
      if (tileNorthEastIsActivePlayer && inactivePlayerExistsInNorthEastTiles && inactivePlayerComesBeforeBlank){
        return true
      }
      else{return false}
    }

  }


  checkNorthWest(rowIndex, colIndex, activePlayer, tempGameState){
    let inactivePlayer = (activePlayer === black ? white : black)
    if (rowIndex ===  0 || colIndex === 0){return false}
    else{
      let tilesFromMeToNorthWest = [];
      let i = rowIndex - 1;
      let j = colIndex - 1;
      while (i >= 0 && j >= 0){
        let result;
        if (tempGameState[i][j] === available){result = blank}
        else{result = tempGameState[i][j]}
        tilesFromMeToNorthWest.push(result);
        i--;
        j--;
      }
      let tileNorthWestIsActivePlayer = (tilesFromMeToNorthWest[0] === activePlayer ? true : false)
      let firstInactivePlayerIndex = tilesFromMeToNorthWest.indexOf(inactivePlayer)
      let firstBlankIndex = tilesFromMeToNorthWest.indexOf(blank)
      if (firstBlankIndex === -1 ){firstBlankIndex = 20}
      if (firstInactivePlayerIndex === -1){return false}
      let inactivePlayerExistsInNorthWestTiles = (firstInactivePlayerIndex !== -1 ? true : false)
      let inactivePlayerComesBeforeBlank = (firstInactivePlayerIndex < firstBlankIndex ? true : false)
      if (tileNorthWestIsActivePlayer && inactivePlayerExistsInNorthWestTiles && inactivePlayerComesBeforeBlank){
        return true
      }
      else{return false}
    }

  }

  checkSouthEast(rowIndex, colIndex, activePlayer, tempGameState){
    let inactivePlayer = (activePlayer === black ? white : black)
    if (rowIndex ===  7 || colIndex === 7){return false}
    else{
      let tilesFromMeToSouthEast = [];
      let i = rowIndex + 1;
      let j = colIndex + 1;
      while (i <= 7 && j <= 7){
        let result;
        if (tempGameState[i][j] === available){result = blank}
        else{result = tempGameState[i][j]}
        tilesFromMeToSouthEast.push(result);
        i++;
        j++;
      }
      let tileSouthEastIsActivePlayer = (tilesFromMeToSouthEast[0] === activePlayer ? true : false)
      let firstInactivePlayerIndex = tilesFromMeToSouthEast.indexOf(inactivePlayer)
      let firstBlankIndex = tilesFromMeToSouthEast.indexOf(blank)
      if (firstBlankIndex === -1 ){firstBlankIndex = 20}
      if (firstInactivePlayerIndex === -1){return false}
      let inactivePlayerExistsInSouthEastTiles = (firstInactivePlayerIndex !== -1 ? true : false)
      let inactivePlayerComesBeforeBlank = (firstInactivePlayerIndex < firstBlankIndex ? true : false)
      if (tileSouthEastIsActivePlayer && inactivePlayerExistsInSouthEastTiles && inactivePlayerComesBeforeBlank){
        return true
      }
      else{return false}
    }

  }

  checkSouthWest(rowIndex, colIndex, activePlayer, tempGameState){
    let inactivePlayer = (activePlayer === black ? white : black)
    if (rowIndex ===  7 || colIndex === 0){return false}
    else{
      let tilesFromMeToSouthWest = [];
      let i = rowIndex + 1;
      let j = colIndex - 1;
      while (i <= 7 && j >= 0){
        let result;
        if (tempGameState[i][j] === available){result = blank}
        else{result = tempGameState[i][j]}
        tilesFromMeToSouthWest.push(result);
        i++;
        j--;
      }
      let tileSouthWestIsActivePlayer = (tilesFromMeToSouthWest[0] === activePlayer ? true : false)
      let firstInactivePlayerIndex = tilesFromMeToSouthWest.indexOf(inactivePlayer)
      let firstBlankIndex = tilesFromMeToSouthWest.indexOf(blank)
      if (firstBlankIndex === -1 ){firstBlankIndex = 20}
      if (firstInactivePlayerIndex === -1){return false}
      let inactivePlayerExistsInSouthWestTiles = (firstInactivePlayerIndex !== -1 ? true : false)
      let inactivePlayerComesBeforeBlank = (firstInactivePlayerIndex < firstBlankIndex ? true : false)
      if (tileSouthWestIsActivePlayer && inactivePlayerExistsInSouthWestTiles && inactivePlayerComesBeforeBlank){
        return true
      }
      else{return false}
    }
 
  }


  setPlayer(activePlayer){
    if(activePlayer === black){
      this.setState({activePlayer: white, inactivePlayer: black})
    }
    else if (activePlayer === white){
      this.setState({activePlayer: black, inactivePlayer: white})
    } 
  }


  //this function updates the game state by assigning the player that just made a move to the appropriate square.
  handleGameState(rowIndex, colIndex, activePlayer, gameState, gameStateTranspose){
     //Initialize Updated Game State and it's transpose
     let updatedGameState = gameState;
     let updatedGameStateTranspose = gameStateTranspose;
     let inactivePlayer = (activePlayer === black ? white : black)

    // color downward
    let downExistance = [];
    let i_d = rowIndex + 1;
    let j_d = colIndex;
    while (i_d <= 7){
      downExistance.push(updatedGameState[i_d][j_d])
      i_d++;
    }
   
    let blankBelow = downExistance.indexOf(blank) !== -1 ? true : false
    let availableBelow = downExistance.indexOf(available) !== -1 ? true : false
    let blankBeforeCurrentPlayer_d = downExistance.indexOf(blank) < downExistance.indexOf(activePlayer) ? true : false
    let availableBeforeCurrentPlayer_d = downExistance.indexOf(available) < downExistance.indexOf(activePlayer) ? true : false
    if (blankBelow && blankBeforeCurrentPlayer_d){
      downExistance = [];
    }
    if ( availableBelow && availableBeforeCurrentPlayer_d ){
      downExistance = [];
    }

    if (downExistance.indexOf(activePlayer) !== -1){
     let i_d = rowIndex + 1;
     let j_d = colIndex;
     let k_d = 0;
     while (i_d <= 7 && downExistance[k_d] !== activePlayer && downExistance[k_d] === inactivePlayer ){
       updatedGameState[i_d][j_d] = activePlayer;
       updatedGameStateTranspose[j_d][i_d] = activePlayer;
       i_d++;
       k_d++;
     }
    }


    // color upward
    let upExistance = [];
    let i_u = rowIndex - 1 ;
    let j_u = colIndex;
    while (i_u >= 0){
      upExistance.push(this.state.gameState[i_u][j_u])
      i_u--;
    }
    
    let blankAbove = upExistance.indexOf(blank) !== -1 ? true : false
    let availableAbove = upExistance.indexOf(available) !== -1 ? true : false
    let blankBeforeCurrentPlayer_u = upExistance.indexOf(blank) < upExistance.indexOf(activePlayer) ? true : false
    let availableBeforeCurrentPlayer_u = upExistance.indexOf(available) < upExistance.indexOf(activePlayer) ? true : false
    if ( blankAbove && blankBeforeCurrentPlayer_u ){
      upExistance = [];
    }
    if ( availableAbove && availableBeforeCurrentPlayer_u ){
      upExistance = [];
    }
    
    if (upExistance.indexOf(activePlayer) !== -1){
     let i_u = rowIndex - 1;
     let j_u = colIndex;
     let k_u = 0;
     while (i_u >= 0 && upExistance[k_u] !== activePlayer && upExistance[k_u] === inactivePlayer){
       updatedGameState[i_u][j_u] = activePlayer;
       updatedGameStateTranspose[j_u][i_u] = activePlayer;
       i_u--;
       k_u++;
     }
    }

    //color to the left
    let leftExistance = [];
    let i_l = rowIndex;
    let j_l = colIndex - 1;
    while (j_l >= 0){
      leftExistance.push(updatedGameState[i_l][j_l])
      j_l--;
    }

    let blankLeft = leftExistance.indexOf(blank) !== -1 ? true : false
    let availableLeft = leftExistance.indexOf(available) !== -1 ? true : false
    let blankBeforeCurrentPlayer_l = leftExistance.indexOf(blank) < leftExistance.indexOf(activePlayer) ? true : false
    let availableBeforeCurrentPlayer_l = leftExistance.indexOf(available) < leftExistance.indexOf(activePlayer) ? true : false
    if ( blankLeft && blankBeforeCurrentPlayer_l ){
      leftExistance = [];
    }
    if ( availableLeft && availableBeforeCurrentPlayer_l ){
      leftExistance = [];
    }

    if (leftExistance.indexOf(activePlayer) !== -1){
     let i_l = rowIndex;
     let j_l = colIndex - 1;
     let k_l = 0;
     while (j_l >= 0 && leftExistance[k_l] !== activePlayer && leftExistance[k_l] === inactivePlayer){
       updatedGameState[i_l][j_l] = activePlayer;
       updatedGameStateTranspose[j_l][i_l] = activePlayer;
       j_l--;
       k_l++;
     }
    }

    // color to the right
     let rightExistance = [];
     let i_r = rowIndex;
     let j_r = colIndex + 1;
     while (j_r <= 7){
       rightExistance.push(updatedGameState[i_r][j_r])
       j_r++;
     }

     let blankRight = rightExistance.indexOf(blank) !== -1 ? true : false
     let availableRight = rightExistance.indexOf(available) !== -1 ? true : false
     let blankBeforeCurrentPlayer_r = rightExistance.indexOf(blank) < rightExistance.indexOf(activePlayer) ? true : false
     let availableBeforeCurrentPlayer_r = rightExistance.indexOf(available) < rightExistance.indexOf(activePlayer) ? true : false
     if ( blankRight && blankBeforeCurrentPlayer_r ){
       rightExistance = [];
     }
     if ( availableRight && availableBeforeCurrentPlayer_r ){
       rightExistance = [];
     }


     if (rightExistance.indexOf(activePlayer) !== -1){
      let i_r = rowIndex;
      let j_r = colIndex + 1;
      let k_r = 0;
      while (j_r <= 7 && rightExistance[k_r] !== activePlayer && rightExistance[k_r] === inactivePlayer){
        updatedGameState[i_r][j_r] = activePlayer;
        updatedGameStateTranspose[j_r][i_r] = activePlayer;
        j_r++;
        k_r++;
      }
     }

     //check north west diagonal existance and color
     let nwDiagonalExistance = [];
     let i_nwd = rowIndex - 1;
     let j_nwd = colIndex + 1;
     while (i_nwd >= 0 && j_nwd <= 7){
       nwDiagonalExistance.push(updatedGameState[i_nwd][j_nwd]);
       i_nwd--;
       j_nwd++;
     }

     let blankNW = nwDiagonalExistance.indexOf(blank) !== -1 ? true : false
     let availableNW = nwDiagonalExistance.indexOf(available) !== -1 ? true : false
     let blankBeforeCurrentPlayer_nw = nwDiagonalExistance.indexOf(blank) < nwDiagonalExistance.indexOf(activePlayer) ? true : false
     let availableBeforeCurrentPlayer_nw = nwDiagonalExistance.indexOf(available) < nwDiagonalExistance.indexOf(activePlayer) ? true : false
     if ( blankNW && blankBeforeCurrentPlayer_nw ){
       nwDiagonalExistance = [];
     }
     if ( availableNW && availableBeforeCurrentPlayer_nw ){
       nwDiagonalExistance = [];
     }


     if (nwDiagonalExistance.indexOf(activePlayer) !== -1){
      let i_nwd = rowIndex - 1;
      let j_nwd = colIndex + 1;
      let k_nwd = 0;
      while (i_nwd >= 0 && j_nwd <= 7 && nwDiagonalExistance[k_nwd] !== activePlayer && nwDiagonalExistance[k_nwd] === inactivePlayer){
        updatedGameState[i_nwd][j_nwd] = activePlayer;
        updatedGameStateTranspose[j_nwd][i_nwd] = activePlayer;
        i_nwd--;
        j_nwd++;
        k_nwd++;
      }
     }

      //check north east diagonal existance and color
      let neDiagonalExistance = [];
      let i_ned = rowIndex - 1;
      let j_ned = colIndex - 1; 
      while (i_ned >= 0 && j_ned >= 0){
        neDiagonalExistance.push(updatedGameState[i_ned][j_ned]);
        i_ned--;
        j_ned--;
      }

      let blankNE = neDiagonalExistance.indexOf(blank) !== -1 ? true : false
      let availableNE = neDiagonalExistance.indexOf(available) !== -1 ? true : false
      let blankBeforeCurrentPlayer_ne = neDiagonalExistance.indexOf(blank) < neDiagonalExistance.indexOf(activePlayer) ? true : false
      let availableBeforeCurrentPlayer_ne = neDiagonalExistance.indexOf(available) < neDiagonalExistance.indexOf(activePlayer) ? true : false
      if ( blankNE && blankBeforeCurrentPlayer_ne ){
        neDiagonalExistance = [];
      }
      if ( availableNE && availableBeforeCurrentPlayer_ne ){
        neDiagonalExistance = [];
      }


      if (neDiagonalExistance.indexOf(activePlayer) !== -1){
        let i_ned = rowIndex - 1;
        let j_ned = colIndex - 1;
        let k_ned = 0;
        while (i_ned >= 0 && j_ned >= 0 && neDiagonalExistance[k_ned] !== activePlayer && neDiagonalExistance[k_ned] === inactivePlayer){
          updatedGameState[i_ned][j_ned] = activePlayer;
          updatedGameStateTranspose[j_ned][i_ned] = activePlayer;
          i_ned--;
          j_ned--;
          k_ned++;
        }
      }
    
      //check south east diagonal existance and color
      let seDiagonalExistance = [];
      let i_sed = rowIndex + 1;
      let j_sed = colIndex + 1;
      while (i_sed <= 7 && j_sed <= 7){
        seDiagonalExistance.push(updatedGameState[i_sed][j_sed]);
        i_sed++;
        j_sed++;
      }


      let blankSE = seDiagonalExistance.indexOf(blank) !== -1 ? true : false
      let availableSE = seDiagonalExistance.indexOf(available) !== -1 ? true : false
      let blankBeforeCurrentPlayer_se = seDiagonalExistance.indexOf(blank) < seDiagonalExistance.indexOf(activePlayer) ? true : false
      let availableBeforeCurrentPlayer_se = seDiagonalExistance.indexOf(available) < seDiagonalExistance.indexOf(activePlayer) ? true : false
      if ( blankSE && blankBeforeCurrentPlayer_se ){
        seDiagonalExistance = [];
      }
      if ( availableSE && availableBeforeCurrentPlayer_se ){
        seDiagonalExistance = [];
      }


      if (seDiagonalExistance.indexOf(activePlayer) !== -1){
        let i_sed = rowIndex + 1;
        let j_sed = colIndex + 1;
        let k_sed = 0;
        while (i_sed <= 7 && j_sed <= 7 && seDiagonalExistance[k_sed] !== activePlayer && seDiagonalExistance[k_sed] === inactivePlayer){
          updatedGameState[i_sed][j_sed] = activePlayer;
          updatedGameStateTranspose[j_sed][i_sed] = activePlayer;
          i_sed++;
          j_sed++;
          k_sed++;
        }
      }
  
      //check south west diagonal existance and color
      let swDiagonalExistance = [];
      let i_swd = rowIndex + 1;
      let j_swd = colIndex - 1;
      while (i_swd <= 7 && j_swd >= 0){
        swDiagonalExistance.push(updatedGameState[i_swd][j_swd]);
        i_swd++;
        j_swd--;
      }


      let blankSW = swDiagonalExistance.indexOf(blank) !== -1 ? true : false
      let availableSW = swDiagonalExistance.indexOf(available) !== -1 ? true : false
      let blankBeforeCurrentPlayer_sw = swDiagonalExistance.indexOf(blank) < swDiagonalExistance.indexOf(activePlayer) ? true : false
      let availableBeforeCurrentPlayer_sw = swDiagonalExistance.indexOf(available) < swDiagonalExistance.indexOf(activePlayer) ? true : false
      if ( blankSW && blankBeforeCurrentPlayer_sw ){
        swDiagonalExistance = [];
      }
      if ( availableSW && availableBeforeCurrentPlayer_sw ){
        swDiagonalExistance = [];
      }


      if (swDiagonalExistance.indexOf(activePlayer) !== -1){
        let i_swd = rowIndex + 1;
        let j_swd = colIndex - 1;
        let k_swd = 0;
        while (i_swd <= 7 && j_swd >= 0 && swDiagonalExistance[k_swd] !== activePlayer && swDiagonalExistance[k_swd] === inactivePlayer){
          updatedGameState[i_swd][j_swd] = activePlayer;
          updatedGameStateTranspose[j_swd][i_swd] = activePlayer;
          i_swd++;
          j_swd--;
          k_swd++;
        }
      }


     //Set the clicked block to whichever player clicked it.
      updatedGameState[rowIndex][colIndex] = activePlayer;
      updatedGameStateTranspose[colIndex][rowIndex] = activePlayer;


     //Remove tiles that were previously labeled as available
     updatedGameState = updatedGameState.map(i => i.map(j => j === available ? j = 0 : j))
     updatedGameStateTranspose = updatedGameStateTranspose.map(i => i.map(j => j === available ? j = 0 : j))

     let tempGameState = updatedGameState
     let tempGameStateTranspose = updatedGameStateTranspose
     //Determine valid tiles surrounding the current player (currently excluding edge cases)
     updatedGameState = updatedGameState.map((i, index_i) => {
       return(
          i.map((j, index_j) => {
            
            return(
              (j === blank || j === available) &&
              ( this.checkTileOnRight(index_i, index_j, activePlayer, tempGameState) || this.checkTileOnLeft(index_i, index_j, activePlayer, tempGameState) || 
               this.checkTileAbove(index_i, index_j, activePlayer, tempGameStateTranspose) || this.checkTileBelow(index_i, index_j, activePlayer, tempGameStateTranspose) || 
               this.checkNorthEast(index_i, index_j, activePlayer, tempGameState) || this.checkNorthWest(index_i, index_j, activePlayer, tempGameState) ||
               this.checkSouthEast(index_i, index_j, activePlayer, tempGameState) || this.checkSouthWest(index_i, index_j, activePlayer, tempGameState) ) ? 
              j = 8 : j
              )
          })
       ) 
      })

      for (let i = 0; i < updatedGameStateTranspose.length; i++){
        for (let j = 0; j < updatedGameStateTranspose[i].length; j++){
          updatedGameStateTranspose[i][j] = updatedGameState[j][i];
        }
      }
    
     let scoreOfState = this.updateScore(gameState)
     let result = {gameState: updatedGameState, gameStateTranspose: updatedGameStateTranspose, activePlayer: activePlayer, scoreOfState: scoreOfState};
  

     return result
  }

  updateState(updatedGameState, updatedGameStateTranspose, activePlayer){
    let newScore = this.updateScore(updatedGameState)
    this.checkForWin(newScore.blackPoints, newScore.whitePoints, newScore.availablePoints)
    this.setState({gameState: updatedGameState, 
                   gameStateTranspose: updatedGameStateTranspose,
                   blackPoints: newScore.blackPoints,
                   whitePoints: newScore.whitePoints,
                   availablePoints: newScore.availablePoints})
    this.setPlayer(activePlayer);
  }

  createGameBoard(gameState){
    let result = gameState.map((i, rowIndex) => {
    
      return(
          <Row className = 'myrow' key = {rowIndex}>
            {i.map((j, colIndex) => {
              return(
                <Tile 
                  key = {colIndex}
                  tileValue = {j} 
                  handleGameState = {this.handleGameState}
                  rowIndex = {rowIndex} 
                  colIndex = {colIndex} 
                  activePlayer = {this.state.activePlayer}
                  handleAI = {this.handleAI}
                  gameMode = {this.state.gameMode}
                  gameState = {this.state.gameState}
                  gameStateTranspose = {this.state.gameStateTranspose}
                  updateState = {this.updateState}
                  black = {black}
                  white = {white}
                  available = {available}
                  humanIsBlack = {this.state.humanIsBlack}
              
                  />
              )
              })
            }
          </Row>
        )
      })

      return result
  }
  
  toggleColor(){
    this.setState({humanIsBlack: !this.state.humanIsBlack})
  }

  toggleDebug(){
    this.setState({debugMode: !this.state.debugMode})
  }

  togglePruning(){
    this.setState({pruning: !this.state.pruning})
  }

  handleDepth(depth){
    this.setState({aiDepth: depth})
  }

  handleDebugDepth(change){
    let depth = this.state.debugDepth + change;
    this.setState({debugDepth: depth})
  }



  render(){

    let gameInfo = {  
                      gameState: this.state.gameState, 
                      gameStateTranspose: this.state.gameStateTranspose, 
                      activePlayer: this.state.activePlayer, 
                      scoreOfState: 
                        {
                          blackPoints: this.state.blackPoints, 
                          whitePoints: this.state.whitePoints, 
                          availablePoints: this.state.availablePoints
                        }
                    }

    let gameMode = (this.state.gameMode === 'menu' ? 
                    <Container className = 'gamecontainer'>
                        <h3>Choose A Mode:</h3>
                        <button onClick={this.handleGameMode.bind(this, '2playergame')}>Human v. Human</button>
                        <button onClick={this.handleGameMode.bind(this, 'aigame')}>Human v. AI</button>
                    </Container> :
                    <Container className = 'gamecontainer'>
                      
                      <div className = 'gameboard' style={{display: 'inline-block'}}
                      onTransitionEnd={this.state.gameMode === 'aigame' && this.state.activePlayer === white ? this.handleAI.bind(this, gameInfo) : null}
                         >
                        {this.createGameBoard(this.state.gameState)}
                      </div>
                     
                      
                        <h4>{this.state.activePlayer === black ? 'Player 1' : 'Player 2'}'s Turn</h4> 
                        <div>
                          <h5>Score for Player 1:</h5>
                          <p>{this.state.blackPoints}</p>
                        </div>
                        <div>
                          <h5>Score for Player 2:</h5>
                          <p>{this.state.whitePoints}</p>
                        </div>
                        <div>
                          {this.state.gameMode === 'gameover' ? <h6>Game Over - {this.state.blackPoints === this.state.whitePoints ? 'Tie Game' : 
                                                                                (this.state.blackPoints > this.state.whitePoints ? 'Black Wins' : 'White Wins')} </h6> :  null}
                        </div>    
                      
                    </Container> 
                      )
    let settings = <Container>
                    <h4>Settings</h4>
                    <h6 style={{marginTop: '1em'}}>Choose your color:</h6>
                    <Button variant={this.state.humanIsBlack ? 'dark' : 'light'} onClick = {this.toggleColor}>Toggle Color</Button>
                    <h6 style={{marginTop: '1em'}}>Debug Mode</h6>
                    <Form>
                      <Form.Check 
                        onClick={this.toggleDebug}
                        type="switch"
                        id="debug-switch"
                        label= {this.state.debugMode ? "On" : "Off"}
                      />
                    </Form>
                    <h6 style={{marginTop: '1em'}}>Cheat</h6>
                    <Button variant = "primary" onClick={this.handleAI.bind(this, gameInfo)}>Click for an AI play</Button>
                    <h6 style={{marginTop: '1em'}}>Alpha Beta Pruning</h6>
                    <Form>
                      <Form.Check 
                        onClick={this.togglePruning}
                        type="switch"
                        id="pruning-switch"
                        label= {this.state.pruning ? "On" : "Off"}
                      />
                    </Form>
                 
                  <h6 style={{marginTop: '1em'}}>Depth</h6>
                  <Form>
                    <Form.Check
                        defaultChecked
                        custom
                        type="radio"
                        label="2"
                        name="formHorizontalRadios"
                        id="formHorizontalRadios1"
                        onClick = {this.handleDepth.bind(this, 3)}
                      />
                      <Form.Check
                        custom
                        type="radio"
                        label="4"
                        name="formHorizontalRadios"
                        id="formHorizontalRadios2"
                        onClick = {this.handleDepth.bind(this, 5)}
                      />
                      <Form.Check
                        custom
                        type="radio"
                        label="6"
                        name="formHorizontalRadios"
                        id="formHorizontalRadios3"
                        onClick = {this.handleDepth.bind(this, 7)}
                      />
                      <Form.Check
                        custom
                        type="radio"
                        label="8"
                        name="formHorizontalRadios"
                        id="formHorizontalRadios4"
                        onClick = {this.handleDepth.bind(this, 9)}
                      />
                  </Form>
                  </Container>


    let debugMode2 = <div style={{margin: '50px'}} >
                      <h4>Debug Mode</h4>
                    

                      {this.state.debugDepth !== undefined ? 
                        <div>
                          <p>
                          {this.state.debugDepth !== this.state.aiDepth ? <button onClick = {this.handleDebugDepth.bind(this, 1)}>Go Up One Level</button> : null}
                          {this.state.debugDepth !== 0 ? <button onClick = {this.handleDebugDepth.bind(this, -1)}>Go Down One Level</button> : null}
                        </p>
                        <p>Level {this.state.debugDepth}</p> 
                        </div> : 
                        null
                
                      }
                      
                      <Row>
                        <Col xs = {12}>
                        {possibleMoves.map((item, index) => {                        
                          if (item.depth === this.state.debugDepth){
                            
                          return(
                            <div style = {{width: '400px', height: '400px', margin: '2em 2em', float: 'left'}}>{item.board}Depth: {item.depth}; Score: {item.score}</div>
                            )
                   
                          }
                          else{
                            return(
                              null
                            )
                          }
                        

                 
                      }
                        )
                      }
                       
                        </Col>
                      </Row>
                     
                      <Row style={{border: '1px solid black'}}>
                      <Col xs = {12}>
                      {this.state.pruning ? <h5>Prunes:</h5> : null}
                      {prunes.map(item => {
                        if (item.depth-1 === this.state.debugDepth){
                          return(
                            <div style = {{width: '400px', height: '400px', margin: '2em 2em', float: 'left'}}>{item.board}Depth: {item.depth-1}; </div>
                          )
                          
                        }
                        else{
                          return(
                            null
                          )
                        }
                      }
                      )}
                      </Col>
                      </Row>
                      
                    </div>

    let debugMode = <div style={{margin: '50px'}} >
                    <h4>Debug Mode</h4>
                    
                    {this.state.moves3.map(item => {
                      let child = item.map(item2 => {
                            return(
                            <div style = {{width: '400px', height: '400px', margin: '2em 2em', float: 'left'}}>{item2.board}</div>
                            )
                          }
                      )
                   

                      return (
                        <Row style = {{borderTop: '1px solid #cccccc'}}>
                        {child}
                        </Row>

                      )
            
                    }
                    
                    )}  

                    {this.state.moves2.map(item => {
                      let child = item.map(item2 => {
                            return(
                            <div style = {{width: '400px', height: '400px', margin: '2em 2em', float: 'left'}}>{item2.board}</div>
                            )
                          }
                      )
                   

                      return (
                        <Row style = {{borderTop: '1px solid #cccccc'}}>
                        {child}
                        </Row>

                      )
            
                    }
                    
                    )}   

                    {this.state.moves1.map(item => {
                      let child = item.map(item2 => {
                            return(
                            <div style = {{width: '400px', height: '400px', margin: '2em 2em', float: 'left'}}>{item2.board}</div>
                            )
                          }
                      )
                   

                      return (
                        <Row style = {{borderTop: '1px solid #cccccc'}}>
                        {child}
                        </Row>

                      )
            
                    }
                    
                    )} 
                    
                    </div>
          
  
    return(
      <React.Fragment>
      <Row>
        <Col className = 'settings' xs  = {3}>{this.state.gameMode === '2playergame' || this.state.gameMode === 'aigame' ? settings : null}</Col>
        <Col className = 'gameMode' xs = {4}>{gameMode}</Col>
      </Row>
        {this.state.debugMode ? <Row style = {{marginTop: '200px'}}><Col className = 'debug'>{debugMode2}</Col></Row> : null}
      </React.Fragment> 
    )
  }
}

export default App;
