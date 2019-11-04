import React from 'react';
import './App.css';
import { Row, Container, Col } from 'react-bootstrap';
import Tile from './components/Tile';

class App extends React.Component{
  constructor(){
    super()
    this.state = {
      // 8 means valid move for current player, 1 is black, 2 white
      gameState : [[0,0,0,0,0,0,0,0],
                   [0,0,0,0,0,0,0,0],
                   [0,0,0,0,8,0,0,0],
                   [0,0,0,1,2,8,0,0],
                   [0,0,8,2,1,0,0,0],
                   [0,0,0,8,0,0,0,0],
                   [0,0,0,0,0,0,0,0],
                   [0,0,0,0,0,0,0,0],],
      gameStateTranspose : [[0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0],
                            [0,0,0,0,8,0,0,0],
                            [0,0,0,1,2,8,0,0],
                            [0,0,8,2,1,0,0,0],
                            [0,0,0,8,0,0,0,0],
                            [0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0],],
      activePlayer : 1,
      inactivePlayer : 2
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
  }

  checkTileOnRight(rowIndex, colIndex){
    // if you're on the edge, don't check the next tile.
    if (colIndex === 7){return false}
    // if you're not on the edge, see if the tile on the right is the same color as the person who just played and if the upcoming player has a piece in this row, return true.
    else if (this.state.gameState[rowIndex][colIndex + 1] === this.state.activePlayer
              && this.state.gameState[rowIndex].indexOf(this.state.inactivePlayer) !== -1){
      return true
    }
    else {return false}
  }

  checkTileOnLeft(rowIndex, colIndex){
      // if you're on the edge, don't check the previous tile.
      if (colIndex === 0){return false}
      // if you're not on the edge, see if the tile on the left is the same color as the person who just played and if the upcoming player has a piece in this row, return true.
      else if (this.state.gameState[rowIndex][colIndex - 1] === this.state.activePlayer 
              && this.state.gameState[rowIndex].indexOf(this.state.inactivePlayer) !== -1){
        return true
      }
      else {return false}
  }

  checkTileAbove(rowIndex, colIndex){
    // if you're on the edge, don't check above.
    if (rowIndex === 0){return false}
    // if you're not on the edge, see if the tile above is the same color as the person who just played and if the upcoming player has a piece in this column, return true.
    else if(this.state.gameState[rowIndex-1][colIndex] === this.state.activePlayer 
            && this.state.gameStateTranspose[colIndex].indexOf(this.state.inactivePlayer) !== -1){
      return true
    }
    else{return false}
  }

  checkTileBelow(rowIndex, colIndex){
    // if you're on the edge, don't check below.
    if (rowIndex === 7){return false}
    // if you're not on the edge, see if the tile below is the same color as the person who just played and if the upcoming player has a piece in this column, return true.
    else if(this.state.gameState[rowIndex+1][colIndex] === this.state.activePlayer 
            && this.state.gameStateTranspose[colIndex].indexOf(this.state.inactivePlayer) !== -1){
      return true
    }
    else{return false}
  }

  checkNorthEast(rowIndex, colIndex){
    if (rowIndex ===  0 || colIndex === 7){return false}
    else if (this.state.gameState[rowIndex - 1][colIndex + 1] === this.state.activePlayer){
      let existance = [];
      let j = colIndex;
      let i = rowIndex;
      while (i >= 0 && j <= 7){
        existance.push(this.state.gameState[i][j])  
        j++;
        i--;
      }
      if (existance.indexOf(this.state.inactivePlayer) !== -1){
        return true
      }
      else{
        return false
      }
    }
    else {
      return false
    }
  }


  checkNorthWest(rowIndex, colIndex){
    if (rowIndex ===  0 || colIndex === 0){return false}
    else if (this.state.gameState[rowIndex - 1][colIndex - 1] === this.state.activePlayer){
      let existance = [];
      let j = colIndex;
      let i = rowIndex;
      while (i >= 0 && j >= 0){
        existance.push(this.state.gameState[i][j])  
        j--;
        i--;
      }
      if (existance.indexOf(this.state.inactivePlayer) !== -1){
        return true
      }
      else{
        return false
      }
    }
    else {
      return false
    }
  }

  checkSouthEast(rowIndex, colIndex){
    if (rowIndex ===  7 || colIndex === 7){return false}
    else if (this.state.gameState[rowIndex + 1][colIndex + 1] === this.state.activePlayer){
      let existance = [];
      let j = colIndex;
      let i = rowIndex;
      while (i <= 7 && j <= 7){
        existance.push(this.state.gameState[i][j])  
        j++;
        i++;
      }
      if (existance.indexOf(this.state.inactivePlayer) !== -1){
        return true
      }
      else{
        return false
      }
    }
    else {
      return false
    }
  }

  checkSouthWest(rowIndex, colIndex){
    if (rowIndex ===  7 || colIndex === 0){return false}
    else if (this.state.gameState[rowIndex + 1][colIndex - 1] === this.state.activePlayer){
      let existance = [];
      let j = colIndex;
      let i = rowIndex;
      while (i <= 7 && j >= 0){
        existance.push(this.state.gameState[i][j])  
        j--;
        i++;
      }
      if (existance.indexOf(this.state.inactivePlayer) !== -1){
        return true
      }
      else{
        return false
      }
    }
    else {
      return false
    }
  }


  setPlayer(){
    if(this.state.activePlayer === 1){
      this.setState({activePlayer: 2, inactivePlayer: 1})
    }
    else if (this.state.activePlayer === 2){
      this.setState({activePlayer: 1, inactivePlayer: 2})
    } 
  }


  //this function updates the game state by assigning the player that just made a move to the appropriate square.
  handleGameState(rowIndex, colIndex){
     //Initialize Updated Game State and it's transpose
     let updatedGameState = this.state.gameState;
     let updatedGameStateTranspose = this.state.gameStateTranspose;
     let activePlayer = this.state.activePlayer;

    /*
     //Determine the index of the first occurrence of the active player's color in each row and column.
     let firstIndeces = updatedGameState.map(i => i.indexOf(this.state.activePlayer))
     let firstIndecesTranspose = updatedGameStateTranspose.map(i => i.indexOf(this.state.activePlayer))

     //For Rows: Change all tiles of the opposite color between input tile and the first tile that has the active player color
     if (firstIndeces[rowIndex] !== -1){
       //if the piece was placed on the left side of other pieces of the acitive player
       for (let i = colIndex; i < firstIndeces[rowIndex]; i++){
         updatedGameState[rowIndex][i] = this.state.activePlayer;
         updatedGameStateTranspose[i][rowIndex] = this.state.activePlayer;
       }
       //If the piece was place on the right side of other pieces of the active player
       for (let i = firstIndeces[rowIndex]; i < colIndex; i++){
        updatedGameState[rowIndex][i] = this.state.activePlayer;
        updatedGameStateTranspose[i][rowIndex] = this.state.activePlayer;
       }
     }

     //For Columns: Change all tiles of the opposite color between the placed tile and the first occurance of the same player
     if (firstIndecesTranspose[colIndex] !== -1){
       //if the piece was placed above another..
       for (let i = rowIndex; i < firstIndecesTranspose[colIndex]; i++){
         updatedGameState[i][colIndex] = this.state.activePlayer;
         updatedGameStateTranspose[colIndex][i] = this.state.activePlayer;
       }
       //if the piece was placed below another....
       for (let i = firstIndecesTranspose[colIndex]; i < rowIndex; i++){
        updatedGameState[i][colIndex] = this.state.activePlayer;
        updatedGameStateTranspose[colIndex][i] = this.state.activePlayer;
      }
     }
     */

    let downExistance = [];
    let i_d = rowIndex;
    let j_d = colIndex;
    while (i_d <= 7){
      downExistance.push(updatedGameState[i_d][j_d])
      i_d++;
    }
    if (downExistance.indexOf(activePlayer) !== -1){
     let i_d = rowIndex;
     let j_d = colIndex;
     let k_d = 0;
     while (i_d <= 7 && downExistance[k_d] !== activePlayer){
       updatedGameState[i_d][j_d] = activePlayer;
       updatedGameStateTranspose[j_d][i_d] = activePlayer;
       i_d++;
       k_d++;
     }
    }


    let upExistance = [];
    let i_u = rowIndex;
    let j_u = colIndex;
    while (i_u >= 0){
      upExistance.push(this.state.gameState[i_u][j_u])
      i_u--;
    }
    if (upExistance.indexOf(this.state.activePlayer) !== -1){
     let i_u = rowIndex;
     let j_u = colIndex;
     let k_u = 0;
     while (i_u >= 0 && upExistance[k_u] !== this.state.activePlayer){
       updatedGameState[i_u][j_u] = this.state.activePlayer;
       updatedGameStateTranspose[j_u][i_u] = this.state.activePlayer;
       i_u--;
       k_u++;
     }
    }


    let leftExistance = [];
    let i_l = rowIndex;
    let j_l = colIndex;
    while (j_l >= 0){
      leftExistance.push(this.state.gameState[i_l][j_l])
      j_l--;
    }
    if (leftExistance.indexOf(this.state.activePlayer) !== -1){
     let i_l = rowIndex;
     let j_l = colIndex;
     let k_l = 0;
     while (j_l >= 0 && leftExistance[k_l] !== this.state.activePlayer){
       updatedGameState[i_l][j_l] = this.state.activePlayer;
       updatedGameStateTranspose[j_l][i_l] = this.state.activePlayer;
       j_l--;
       k_l++;
     }
    }


     let rightExistance = [];
     let i_r = rowIndex;
     let j_r = colIndex;
     while (j_r <= 7){
       rightExistance.push(this.state.gameState[i_r][j_r])
       j_r++;
     }
     if (rightExistance.indexOf(this.state.activePlayer) !== -1){
      let i_r = rowIndex;
      let j_r = colIndex;
      let k_r = 0;
      while (j_r <= 7 && rightExistance[k_r] !== this.state.activePlayer){
        updatedGameState[i_r][j_r] = this.state.activePlayer;
        updatedGameStateTranspose[j_r][i_r] = this.state.activePlayer;
        j_r++;
        k_r++;
      }
     }

     //check north west diagonal existance and color
     let nwDiagonalExistance = [];
     let i_nwd = rowIndex;
     let j_nwd = colIndex;
     while (i_nwd >= 0 && j_nwd <= 7){
       nwDiagonalExistance.push(this.state.gameState[i_nwd][j_nwd]);
       i_nwd--;
       j_nwd++;
     }
     if (nwDiagonalExistance.indexOf(this.state.activePlayer) !== -1){
      let i_nwd = rowIndex;
      let j_nwd = colIndex;
      let k_nwd = 0;
      while (i_nwd >= 0 && j_nwd <= 7 && nwDiagonalExistance[k_nwd] !== this.state.activePlayer){
        updatedGameState[i_nwd][j_nwd] = this.state.activePlayer;
        updatedGameStateTranspose[j_nwd][i_nwd] = this.state.activePlayer;
        i_nwd--;
        j_nwd++;
        k_nwd++;
      }
     }

      //check north east diagonal existance and color
      let neDiagonalExistance = [];
      let i_ned = rowIndex;
      let j_ned = colIndex;
      while (i_ned >= 0 && j_ned >= 0){
        neDiagonalExistance.push(this.state.gameState[i_ned][j_ned]);
        i_ned--;
        j_ned--;
      }
      if (neDiagonalExistance.indexOf(this.state.activePlayer) !== -1){
        let i_ned = rowIndex;
        let j_ned = colIndex;
        let k_ned = 0;
        while (i_ned >= 0 && j_ned >= 0 && neDiagonalExistance[k_ned] !== this.state.activePlayer){
          updatedGameState[i_ned][j_ned] = this.state.activePlayer;
          updatedGameStateTranspose[j_ned][i_ned] = this.state.activePlayer;
          i_ned--;
          j_ned--;
          k_ned++;
        }
      }
    
      //check south east diagonal existance and color
      let seDiagonalExistance = [];
      let i_sed = rowIndex;
      let j_sed = colIndex;
      while (i_sed <= 7 && j_sed >= 0){
        seDiagonalExistance.push(updatedGameState[i_sed][j_sed]);
        i_sed++;
        j_sed--;
      }
      if (seDiagonalExistance.indexOf(activePlayer) !== -1){
        let i_sed = rowIndex;
        let j_sed = colIndex;
        let k_sed = 0;
        while (i_sed <= 7 && j_sed >= 0 && seDiagonalExistance[k_sed] !== activePlayer){
          updatedGameState[i_sed][j_sed] = activePlayer;
          updatedGameStateTranspose[j_sed][i_sed] = activePlayer;
          i_sed++;
          j_sed--;
          k_sed++;
        }
      }
  
      //check south west diagonal existance and color
      let swDiagonalExistance = [];
      let i_swd = rowIndex;
      let j_swd = colIndex;
      while (i_swd <= 7 && j_swd <= 7){
        swDiagonalExistance.push(this.state.gameState[i_swd][j_swd]);
        i_swd++;
        j_swd++;
      }
      if (swDiagonalExistance.indexOf(this.state.activePlayer) !== -1){
        let i_swd = rowIndex;
        let j_swd = colIndex;
        let k_swd = 0;
        while (i_swd <= 7 && j_swd <= 7 && swDiagonalExistance[k_swd] !== this.state.activePlayer){
          updatedGameState[i_swd][j_swd] = this.state.activePlayer;
          updatedGameStateTranspose[j_swd][i_swd] = this.state.activePlayer;
          i_swd++;
          j_swd++;
          k_swd++;
        }
      }


     //Set the clicked block to whichever player clicked it.
      updatedGameState[rowIndex][colIndex] = this.state.activePlayer;
      updatedGameStateTranspose[colIndex][rowIndex] = this.state.activePlayer;


     //Remove tiles that were previously labeled as available
     updatedGameState = updatedGameState.map(i => i.map(j => j === 8 ? j = 0 : j))
     updatedGameStateTranspose = updatedGameStateTranspose.map(i => i.map(j => j === 8 ? j = 0 : j))

     //Determine valid tiles surrounding the current player (currently excluding edge cases)
     updatedGameState = updatedGameState.map((i, index_i) => {
       return(
          i.map((j, index_j) => {
            
            return(
              j === 0 && 
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
  
    return(
      <React.Fragment>
      <Container>
        <div className = 'gameboard'>
          {updateBoard}
        </div>
        <div>Player {this.state.activePlayer}'s Turn</div> 
      </Container>
      <div style = {{display: 'inline-block', margin: '4em'}}>
      <h5>GameState</h5>
      {this.state.gameState.map(i => <div style={{display: 'block'}}>{i.map(j => <div style = {{display: 'inline-block', margin: '2px', width: '20px'}}>{j}</div>)}</div>)}
      </div>
      <div style = {{display: 'inline-block', margin: '4em'}}>
      <h5>GameStateTranspose</h5>
      {this.state.gameStateTranspose.map(i => <div style={{display: 'block'}}>{i.map(j => <div style = {{display: 'inline-block', margin: '2px', width: '20px'}}>{j}</div>)}</div>)}
      </div>
      </React.Fragment>
    )
  }
}

export default App;
