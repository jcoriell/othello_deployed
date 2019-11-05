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
import { Row, Container } from 'react-bootstrap';
import Tile from './components/Tile';

const black = 1;
const white = 2;
const available = 8;
const blank = 0;

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
      activePlayer : 1,
      inactivePlayer : 2,
      blackPoints: 2,
      whitePoints: 2,
      availablePoints: 4,
      gameMode: 'menu'
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
  }

  handleGameMode(mode){
    this.setState({gameMode: mode})
  }

  updateScore(array){
    let blackScore = 0;
    let whiteScore = 0;
    let availableSpots = 0;
    for (let i = 0; i < this.state.gameState.length; i++){
      for (let j = 0; j < this.state.gameState[i].length; j++){
        if (this.state.gameState[i][j] === black){blackScore++;}
        if (this.state.gameState[i][j] === white){whiteScore++;}
      }
    }
    for (let i = 0; i < array.length; i++){
      for (let j = 0; j < array[i].length; j++){
        if (array[i][j] === available){availableSpots++}
      }
    }
    this.setState({blackPoints: blackScore, whitePoints: whiteScore, availablePoints: availableSpots})
    
    
    if (blackScore + whiteScore === 64 || availableSpots === 0){
      this.handleGameMode('gameover')
    }
  }

  checkTileOnRight(rowIndex, colIndex){
    // if you're on the edge, don't check the next tile.
    if (colIndex === 7){return false}
    // if you're not on the edge, see if the tile on the right is the same color as the person who just played and if the upcoming player has a piece in this row, return true.
    else {
      let tilesOnRightFromMeToRight = [];
      let i = rowIndex;
      let j = colIndex + 1;
      while (j <= 7){
        let result;
        if (this.state.gameState[i][j] === available){result = blank}
        else{result = this.state.gameState[i][j]}
        tilesOnRightFromMeToRight.push(result);
        j++;
      } 
      let tileOnRightIsActivePlayer = (tilesOnRightFromMeToRight[0] === this.state.activePlayer ? true : false)
      let firstInactivePlayerIndex = tilesOnRightFromMeToRight.indexOf(this.state.inactivePlayer)
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

  checkTileOnLeft(rowIndex, colIndex){
    // if you're on the edge, don't check the previous tile.
    if (colIndex === 0){return false}
    else{
      let tilesOnLeftFromMeToLeft = [];
      let i = rowIndex;
      let j = colIndex - 1;
      while (j >= 0){
        let result;
        if (this.state.gameState[i][j] === available){result = blank}
        else{result = this.state.gameState[i][j]}
        tilesOnLeftFromMeToLeft.push(result);
        j--;
      } 
      let tileOnLeftIsActivePlayer = (tilesOnLeftFromMeToLeft[0] === this.state.activePlayer ? true : false)
      let firstInactivePlayerIndex = tilesOnLeftFromMeToLeft.indexOf(this.state.inactivePlayer)
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

  checkTileAbove(rowIndex, colIndex){
    // if you're on the edge, don't check above.
    if (rowIndex === 0){return false}
    else{
      let tilesAboveFromMeToTop = this.state.gameStateTranspose[colIndex].slice(0, rowIndex).reverse()  //creates an array of the tile on the right of the current one.
      let tileAboveIsActivePlayer = (tilesAboveFromMeToTop[0] === this.state.activePlayer ? true : false)
      let firstInactivePlayerIndex = tilesAboveFromMeToTop.indexOf(this.state.inactivePlayer)
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

  checkTileBelow(rowIndex, colIndex){
    // if you're on the edge, don't check above.
    if (rowIndex === 7){return false}
    else{
      let tilesBelowFromMeToBottom = this.state.gameStateTranspose[colIndex].slice(rowIndex + 1)
      let tileBelowIsActivePlayer = (tilesBelowFromMeToBottom[0] === this.state.activePlayer ? true : false)
      let firstInactivePlayerIndex = tilesBelowFromMeToBottom.indexOf(this.state.inactivePlayer)
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


  checkNorthEast(rowIndex, colIndex){
    if (rowIndex ===  0 || colIndex === 7){return false}
    else{
      let tilesFromMeToNorthEast = [];
      let i = rowIndex - 1;
      let j = colIndex + 1;
      while (i >= 0 && j <= 7){
        let result;
        if (this.state.gameState[i][j] === available){result = blank}
        else{result = this.state.gameState[i][j]}
        tilesFromMeToNorthEast.push(result);
        i--;
        j++;
      }
      let tileNorthEastIsActivePlayer = (tilesFromMeToNorthEast[0] === this.state.activePlayer ? true : false)
      let firstInactivePlayerIndex = tilesFromMeToNorthEast.indexOf(this.state.inactivePlayer)
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


  checkNorthWest(rowIndex, colIndex){
    if (rowIndex ===  0 || colIndex === 0){return false}
    else{
      let tilesFromMeToNorthWest = [];
      let i = rowIndex - 1;
      let j = colIndex - 1;
      while (i >= 0 && j >= 0){
        let result;
        if (this.state.gameState[i][j] === available){result = blank}
        else{result = this.state.gameState[i][j]}
        tilesFromMeToNorthWest.push(result);
        i--;
        j--;
      }
      let tileNorthWestIsActivePlayer = (tilesFromMeToNorthWest[0] === this.state.activePlayer ? true : false)
      let firstInactivePlayerIndex = tilesFromMeToNorthWest.indexOf(this.state.inactivePlayer)
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

  checkSouthEast(rowIndex, colIndex){
    if (rowIndex ===  7 || colIndex === 7){return false}
    else{
      let tilesFromMeToSouthEast = [];
      let i = rowIndex + 1;
      let j = colIndex + 1;
      while (i <= 7 && j <= 7){
        let result;
        if (this.state.gameState[i][j] === available){result = blank}
        else{result = this.state.gameState[i][j]}
        tilesFromMeToSouthEast.push(result);
        i++;
        j++;
      }
      let tileSouthEastIsActivePlayer = (tilesFromMeToSouthEast[0] === this.state.activePlayer ? true : false)
      let firstInactivePlayerIndex = tilesFromMeToSouthEast.indexOf(this.state.inactivePlayer)
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

  checkSouthWest(rowIndex, colIndex){
    if (rowIndex ===  7 || colIndex === 0){return false}
    else{
      let tilesFromMeToSouthWest = [];
      let i = rowIndex + 1;
      let j = colIndex - 1;
      while (i <= 7 && j >= 0){
        let result;
        if (this.state.gameState[i][j] === available){result = blank}
        else{result = this.state.gameState[i][j]}
        tilesFromMeToSouthWest.push(result);
        i++;
        j--;
      }
      let tileSouthWestIsActivePlayer = (tilesFromMeToSouthWest[0] === this.state.activePlayer ? true : false)
      let firstInactivePlayerIndex = tilesFromMeToSouthWest.indexOf(this.state.inactivePlayer)
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


  setPlayer(){
    if(this.state.activePlayer === black){
      this.setState({activePlayer: white, inactivePlayer: black})
    }
    else if (this.state.activePlayer === white){
      this.setState({activePlayer: black, inactivePlayer: white})
    } 
  }


  //this function updates the game state by assigning the player that just made a move to the appropriate square.
  handleGameState(rowIndex, colIndex){
     //Initialize Updated Game State and it's transpose
     let updatedGameState = this.state.gameState;
     let updatedGameStateTranspose = this.state.gameStateTranspose;
     let activePlayer = this.state.activePlayer;

    // color downward
    let downExistance = [];
    let i_d = rowIndex + 1;
    let j_d = colIndex;
    while (i_d <= 7){
      downExistance.push(this.state.gameState[i_d][j_d])
      i_d++;
    }
   
    let blankBelow = downExistance.indexOf(blank) !== -1 ? true : false
    let availableBelow = downExistance.indexOf(available) !== -1 ? true : false
    let blankBeforeCurrentPlayer_d = downExistance.indexOf(blank) < downExistance.indexOf(this.state.activePlayer) ? true : false
    let availableBeforeCurrentPlayer_d = downExistance.indexOf(available) < downExistance.indexOf(this.state.activePlayer) ? true : false
    if (blankBelow && blankBeforeCurrentPlayer_d){
      downExistance = [];
    }
    if ( availableBelow && availableBeforeCurrentPlayer_d ){
      downExistance = [];
    }

    if (downExistance.indexOf(this.state.activePlayer) !== -1){
     let i_d = rowIndex + 1;
     let j_d = colIndex;
     let k_d = 0;
     while (i_d <= 7 && downExistance[k_d] !== this.state.activePlayer && downExistance[k_d] === this.state.inactivePlayer ){
       updatedGameState[i_d][j_d] = this.state.activePlayer;
       updatedGameStateTranspose[j_d][i_d] = this.state.activePlayer;
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
    let blankBeforeCurrentPlayer_u = upExistance.indexOf(blank) < upExistance.indexOf(this.state.activePlayer) ? true : false
    let availableBeforeCurrentPlayer_u = upExistance.indexOf(available) < upExistance.indexOf(this.state.activePlayer) ? true : false
    if ( blankAbove && blankBeforeCurrentPlayer_u ){
      upExistance = [];
    }
    if ( availableAbove && availableBeforeCurrentPlayer_u ){
      upExistance = [];
    }
    
    if (upExistance.indexOf(this.state.activePlayer) !== -1){
     let i_u = rowIndex - 1;
     let j_u = colIndex;
     let k_u = 0;
     while (i_u >= 0 && upExistance[k_u] !== this.state.activePlayer && upExistance[k_u] ===this.state.inactivePlayer){
       updatedGameState[i_u][j_u] = this.state.activePlayer;
       updatedGameStateTranspose[j_u][i_u] = this.state.activePlayer;
       i_u--;
       k_u++;
     }
    }

    //color to the left
    let leftExistance = [];
    let i_l = rowIndex;
    let j_l = colIndex - 1;
    while (j_l >= 0){
      leftExistance.push(this.state.gameState[i_l][j_l])
      j_l--;
    }

    let blankLeft = leftExistance.indexOf(blank) !== -1 ? true : false
    let availableLeft = leftExistance.indexOf(available) !== -1 ? true : false
    let blankBeforeCurrentPlayer_l = leftExistance.indexOf(blank) < leftExistance.indexOf(this.state.activePlayer) ? true : false
    let availableBeforeCurrentPlayer_l = leftExistance.indexOf(available) < leftExistance.indexOf(this.state.activePlayer) ? true : false
    if ( blankLeft && blankBeforeCurrentPlayer_l ){
      leftExistance = [];
    }
    if ( availableLeft && availableBeforeCurrentPlayer_l ){
      leftExistance = [];
    }

    if (leftExistance.indexOf(this.state.activePlayer) !== -1){
     let i_l = rowIndex;
     let j_l = colIndex - 1;
     let k_l = 0;
     while (j_l >= 0 && leftExistance[k_l] !== this.state.activePlayer && leftExistance[k_l] === this.state.inactivePlayer){
       updatedGameState[i_l][j_l] = this.state.activePlayer;
       updatedGameStateTranspose[j_l][i_l] = this.state.activePlayer;
       j_l--;
       k_l++;
     }
    }

    // color to the right
     let rightExistance = [];
     let i_r = rowIndex;
     let j_r = colIndex + 1;
     while (j_r <= 7){
       rightExistance.push(this.state.gameState[i_r][j_r])
       j_r++;
     }

     let blankRight = rightExistance.indexOf(blank) !== -1 ? true : false
     let availableRight = rightExistance.indexOf(available) !== -1 ? true : false
     let blankBeforeCurrentPlayer_r = rightExistance.indexOf(blank) < rightExistance.indexOf(this.state.activePlayer) ? true : false
     let availableBeforeCurrentPlayer_r = rightExistance.indexOf(available) < rightExistance.indexOf(this.state.activePlayer) ? true : false
     if ( blankRight && blankBeforeCurrentPlayer_r ){
       rightExistance = [];
     }
     if ( availableRight && availableBeforeCurrentPlayer_r ){
       rightExistance = [];
     }


     if (rightExistance.indexOf(this.state.activePlayer) !== -1){
      let i_r = rowIndex;
      let j_r = colIndex + 1;
      let k_r = 0;
      while (j_r <= 7 && rightExistance[k_r] !== this.state.activePlayer && rightExistance[k_r] === this.state.inactivePlayer){
        updatedGameState[i_r][j_r] = this.state.activePlayer;
        updatedGameStateTranspose[j_r][i_r] = this.state.activePlayer;
        j_r++;
        k_r++;
      }
     }

     //check north west diagonal existance and color
     let nwDiagonalExistance = [];
     let i_nwd = rowIndex - 1;
     let j_nwd = colIndex + 1;
     while (i_nwd >= 0 && j_nwd <= 7){
       nwDiagonalExistance.push(this.state.gameState[i_nwd][j_nwd]);
       i_nwd--;
       j_nwd++;
     }

     let blankNW = nwDiagonalExistance.indexOf(blank) !== -1 ? true : false
     let availableNW = nwDiagonalExistance.indexOf(available) !== -1 ? true : false
     let blankBeforeCurrentPlayer_nw = nwDiagonalExistance.indexOf(blank) < nwDiagonalExistance.indexOf(this.state.activePlayer) ? true : false
     let availableBeforeCurrentPlayer_nw = nwDiagonalExistance.indexOf(available) < nwDiagonalExistance.indexOf(this.state.activePlayer) ? true : false
     if ( blankNW && blankBeforeCurrentPlayer_nw ){
       nwDiagonalExistance = [];
     }
     if ( availableNW && availableBeforeCurrentPlayer_nw ){
       nwDiagonalExistance = [];
     }


     if (nwDiagonalExistance.indexOf(this.state.activePlayer) !== -1){
      let i_nwd = rowIndex - 1;
      let j_nwd = colIndex + 1;
      let k_nwd = 0;
      while (i_nwd >= 0 && j_nwd <= 7 && nwDiagonalExistance[k_nwd] !== this.state.activePlayer && nwDiagonalExistance[k_nwd] === this.state.inactivePlayer){
        updatedGameState[i_nwd][j_nwd] = this.state.activePlayer;
        updatedGameStateTranspose[j_nwd][i_nwd] = this.state.activePlayer;
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
        neDiagonalExistance.push(this.state.gameState[i_ned][j_ned]);
        i_ned--;
        j_ned--;
      }

      let blankNE = neDiagonalExistance.indexOf(blank) !== -1 ? true : false
      let availableNE = neDiagonalExistance.indexOf(available) !== -1 ? true : false
      let blankBeforeCurrentPlayer_ne = neDiagonalExistance.indexOf(blank) < neDiagonalExistance.indexOf(this.state.activePlayer) ? true : false
      let availableBeforeCurrentPlayer_ne = neDiagonalExistance.indexOf(available) < neDiagonalExistance.indexOf(this.state.activePlayer) ? true : false
      if ( blankNE && blankBeforeCurrentPlayer_ne ){
        neDiagonalExistance = [];
      }
      if ( availableNE && availableBeforeCurrentPlayer_ne ){
        neDiagonalExistance = [];
      }


      if (neDiagonalExistance.indexOf(this.state.activePlayer) !== -1){
        let i_ned = rowIndex - 1;
        let j_ned = colIndex - 1;
        let k_ned = 0;
        while (i_ned >= 0 && j_ned >= 0 && neDiagonalExistance[k_ned] !== this.state.activePlayer && neDiagonalExistance[k_ned] === this.state.inactivePlayer){
          updatedGameState[i_ned][j_ned] = this.state.activePlayer;
          updatedGameStateTranspose[j_ned][i_ned] = this.state.activePlayer;
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
        seDiagonalExistance.push(this.state.gameState[i_sed][j_sed]);
        i_sed++;
        j_sed++;
      }


      let blankSE = seDiagonalExistance.indexOf(blank) !== -1 ? true : false
      let availableSE = seDiagonalExistance.indexOf(available) !== -1 ? true : false
      let blankBeforeCurrentPlayer_se = seDiagonalExistance.indexOf(blank) < seDiagonalExistance.indexOf(this.state.activePlayer) ? true : false
      let availableBeforeCurrentPlayer_se = seDiagonalExistance.indexOf(available) < seDiagonalExistance.indexOf(this.state.activePlayer) ? true : false
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
        while (i_sed <= 7 && j_sed <= 7 && seDiagonalExistance[k_sed] !== this.state.activePlayer && seDiagonalExistance[k_sed] === this.state.inactivePlayer){
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
        swDiagonalExistance.push(this.state.gameState[i_swd][j_swd]);
        i_swd++;
        j_swd--;
      }


      let blankSW = swDiagonalExistance.indexOf(blank) !== -1 ? true : false
      let availableSW = swDiagonalExistance.indexOf(available) !== -1 ? true : false
      let blankBeforeCurrentPlayer_sw = swDiagonalExistance.indexOf(blank) < swDiagonalExistance.indexOf(this.state.activePlayer) ? true : false
      let availableBeforeCurrentPlayer_sw = swDiagonalExistance.indexOf(available) < swDiagonalExistance.indexOf(this.state.activePlayer) ? true : false
      if ( blankSW && blankBeforeCurrentPlayer_sw ){
        swDiagonalExistance = [];
      }
      if ( availableSW && availableBeforeCurrentPlayer_sw ){
        swDiagonalExistance = [];
      }


      if (swDiagonalExistance.indexOf(this.state.activePlayer) !== -1){
        let i_swd = rowIndex + 1;
        let j_swd = colIndex - 1;
        let k_swd = 0;
        while (i_swd <= 7 && j_swd >= 0 && swDiagonalExistance[k_swd] !== this.state.activePlayer && swDiagonalExistance[k_swd] === this.state.inactivePlayer){
          updatedGameState[i_swd][j_swd] = this.state.activePlayer;
          updatedGameStateTranspose[j_swd][i_swd] = this.state.activePlayer;
          i_swd++;
          j_swd--;
          k_swd++;
        }
      }


     //Set the clicked block to whichever player clicked it.
      updatedGameState[rowIndex][colIndex] = this.state.activePlayer;
      updatedGameStateTranspose[colIndex][rowIndex] = this.state.activePlayer;


     //Remove tiles that were previously labeled as available
     updatedGameState = updatedGameState.map(i => i.map(j => j === available ? j = 0 : j))
     updatedGameStateTranspose = updatedGameStateTranspose.map(i => i.map(j => j === available ? j = 0 : j))

     //Update the app state
     this.setState({gameState: updatedGameState, gameStateTranspose: updatedGameStateTranspose})
     //Determine valid tiles surrounding the current player (currently excluding edge cases)
     updatedGameState = updatedGameState.map((i, index_i) => {
       return(
          i.map((j, index_j) => {
            
            return(
              (j === blank || j === available) &&
              ( this.checkTileOnRight(index_i, index_j) || this.checkTileOnLeft(index_i, index_j) || 
               this.checkTileAbove(index_i, index_j) || this.checkTileBelow(index_i, index_j) || 
               this.checkNorthEast(index_i, index_j) || this.checkNorthWest(index_i, index_j) ||
               this.checkSouthEast(index_i, index_j) || this.checkSouthWest(index_i, index_j) ) ? 
              j = 8 : j
              )
          })
       ) 
      })




     //Update the app state
     this.setState({gameState: updatedGameState, gameStateTranspose: updatedGameStateTranspose})
     this.updateScore(updatedGameState);
     this.setPlayer();
     
  }
  

  render(){
    //create a row for each row in the gameState. Map each item in each row of the gameState to a tile.
    let updateBoard = this.state.gameState.map((i, rowIndex) => {

    return(
        <Row key = {rowIndex}>
          {i.map((j, colIndex) => {
            return(
              <Tile 
                key = {colIndex}
                tileValue = {j} 
                handleGameState = {this.handleGameState}
                rowIndex = {rowIndex} 
                colIndex = {colIndex} 
                activePlayer = {this.state.activePlayer}
                />
            )
            })
          }
        </Row>
      )
    })

    let gameMode = (this.state.gameMode === 'menu' ? 
                    <Container>
                        <h3>Choose A Mode:</h3>
                        <button onClick={this.handleGameMode.bind(this, '2playergame')}>Human v. Human</button>
                        <button>Human v. AI</button>
                    </Container> :
                    <Container>
                      <div className = 'gameboard'>
                        {updateBoard}
                      </div>
                      <h4>{this.state.activePlayer === black ? 'Black' : 'White'}'s Turn</h4> 
                      <div>
                        <h5>Score for Black:</h5>
                        <p>{this.state.blackPoints}</p>
                      </div>
                      <div>
                        <h5>Score for White:</h5>
                        <p>{this.state.whitePoints}</p>
                      </div>
                      <div>
                        {this.state.gameMode === 'gameover' ? <h6>Game Over - {this.state.blackPoints === this.state.whitePoints ? 'Tie Game' : 
                                                                              (this.state.blackPoints > this.state.whitePoints ? 'Black Wins' : 'White Wins')} </h6> :  null}
                      </div>
                      <div>{this.state.availablePoints}</div>
                    </Container> 
                      )
          
  
    return(
      <React.Fragment>
        {gameMode}
      </React.Fragment>
    )
  }
}

export default App;
