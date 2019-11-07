import React from 'react';
import '../App.css';
import { Col } from 'react-bootstrap'

class Tile extends React.Component{
    constructor(){
        super();
        this.handleClick = this.handleClick.bind(this);
        this.determineTileType = this.determineTileType.bind(this);
    }

    handleClick(){
        if (this.props.gameMode === '2playergame' && this.props.tileValue === this.props.available ){
           let newGameState = this.props.handleGameState(this.props.rowIndex, this.props.colIndex, this.props.activePlayer, this.props.gameState, this.props.gameStateTranspose);
           this.props.updateState(newGameState.gameState, newGameState.gameStateTranspose, newGameState.activePlayer)
        }
        if (this.props.gameMode === 'aigame' && this.props.tileValue === this.props.available && this.props.activePlayer === this.props.black){
           let newGameState = this.props.handleGameState(this.props.rowIndex, this.props.colIndex, this.props.activePlayer, this.props.gameState, this.props.gameStateTranspose);
           this.props.updateState(newGameState.gameState, newGameState.gameStateTranspose, newGameState.activePlayer)
        }
        
    }

    determineTileType(){
        let result;

        if (this.props.tileValue === 1){
            if (this.props.humanIsBlack){
                result = 'player1'
            }
            else{
                result = 'player2'
            }
        }
        else if (this.props.tileValue === 2){
            if (this.props.humanIsBlack){
                result = 'player2'
            }
            else{
                result = 'player1'
            }
        }
        else if (this.props.tileValue=== this.props.available){
            result = 'adjacentTile'
        }
        else {
            result = 'empty'
        }
        return result;
    }

    render(){
        let tileStyle = this.determineTileType();

        return(
            <Col className = 'mycol' onClick={this.handleClick}><div className = {tileStyle}></div></Col>
        )
    }
}

export default Tile;