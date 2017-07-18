import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import GameList from './GameList';

class Games extends Component {
    render() {
        const match = this.props.match;
        return (
            <div>
                <Route exact path={match.url} render={() => <Redirect to="/games/all" />} />
                <Route exact path={`${match.url}/featured`} render={() => <GameList featured={true} />} />
                <Route exact path={`${match.url}/all`} render={() => <GameList featured={false} />} />
            </div>
        );
    }
}

export default Games;
