import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class GameListGame extends Component {
    render() {
        const game = this.props.game;

        return (
            <li>
                <Link to={`/game/${game.id}/${game.slug}`}>{game.name}</Link>
            </li>
        );
    }
}

export default GameListGame;
