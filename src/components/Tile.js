import React from 'react';
import '../App.css';
import { Col } from 'react-bootstrap'

class Tile extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            owner: this.props.tileValue,
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        this.setState({
            owner: this.props.activePlayer,
        })
        this.props.handleGameState(this.props.rowIndex, this.props.colIndex, this.props.activePlayer);
    }

    render(){
        let tileStyle;
        if (this.state.owner === 1){
            tileStyle = 'player1'
        }
        else if (this.state.owner === 2){
            tileStyle = 'player2'
        }
        else {
            tileStyle = 'empty'
        }

        return(
            <Col onClick={this.handleClick}><div className = {tileStyle}></div></Col>
        )
    }
}

export default Tile;