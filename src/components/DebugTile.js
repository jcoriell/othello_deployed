import React from 'react';
import '../App.css';
import { Col } from 'react-bootstrap'

class DebugTile extends React.Component{
    constructor(){
        super();
        this.determineTileType = this.determineTileType.bind(this)
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
            <Col className = 'mycol'><div className = {tileStyle}></div></Col>
        )
    }

}


export default DebugTile;
