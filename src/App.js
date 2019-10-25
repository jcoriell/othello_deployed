import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Row, Col } from 'react-bootstrap'

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
                   [0,0,0,0,0,0,0,0],]
    }
  }



  render(){
     
    let updateBoard = this.state.gameState.map(i => {
        return(
          <Row>
            {i.map(j => <Col>{j}</Col>)}
          </Row>
        )
      })

    return(
      <div>
        {updateBoard}
        working?
      </div>
    )
  }
}

export default App;
