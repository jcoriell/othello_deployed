import React from 'react';
import './App.css';
import { Row, Container } from 'react-bootstrap';
import Tile from './components/Tile';

class App extends React.Component{
  constructor(){
    super()
    this.state = {
      gameState : [[0,0,0,0,0,0,0,0],
                   [0,0,0,0,0,0,0,0],
                   [0,0,0,0,0,0,0,0],
                   [0,0,0,1,2,0,0,0],
                   [0,0,0,2,1,0,0,0],
                   [0,0,0,0,0,0,0,0],
                   [0,0,0,0,0,0,0,0],
                   [0,0,0,0,0,0,0,0],],
      activePlayer : 1
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(){
    if(this.state.activePlayer === 1){
      this.setState({activePlayer: 2})
    }
    else if (this.state.activePlayer === 2){
      this.setState({activePlayer: 1})
    }
    
  }

  render(){
     
    //create a row for each row in the gameState. Map each item in each row of the gameState to a tile.
    let updateBoard = this.state.gameState.map(i => {
        return(
          <Row>
            {i.map(j => <Tile tileValue = {j} activePlayer = {this.state.activePlayer}/>)}
          </Row>
        )
      })

    return(
      <Container>
        <div className = 'gameboard' onClick={this.handleClick}>
          {updateBoard}
        </div>
      </Container>
    )
  }
}

export default App;
