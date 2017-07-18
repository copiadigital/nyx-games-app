import React, { Component } from 'react';

class GameListGame extends Component {
    render() {
        return (
            <li>
                <p>{this.props.game.name}</p>
            </li>
        );
    }
}

export default GameListGame;
