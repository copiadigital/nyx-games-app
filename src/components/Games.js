import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Game from './Game';
import GameList from './GameList';

class Games extends Component {
    render() {
        const match = this.props.match;
        return (
            <div>
                <Route path={`${match.url}/:gameSlug`} component={Game} />
                <Route exact path={match.url} component={GameList} />
            </div>
        );
    }
}

export default Games;
