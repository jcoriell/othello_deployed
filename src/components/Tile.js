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
        if (this.props.tileValue === 8){
            this.props.handleGameState(this.props.rowIndex, this.props.colIndex, this.props.activePlayer, this.props.gameState, this.props.gameStateTranspose);
        }
    }

    determineTileType(){
        let result;

        if (this.props.tileValue === 1){
            result = 'player1'
        }
        else if (this.props.tileValue === 2){
            result = 'player2'
        }
        else if (this.props.tileValue=== 8){
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
            <Col onClick={this.handleClick}><div className = {tileStyle}></div></Col>
        )
    }
}

export default Tile;