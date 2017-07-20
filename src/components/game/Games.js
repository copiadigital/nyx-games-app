import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import GamesFiltered from '../games/GamesFiltered';

class Games extends Component {
    render() {
        const match = this.props.match;
        return (
            <div>
                <Switch>
                    <Route exact path={match.url} render={() => <GamesFiltered featured={true} />} />
                    <Route exact path={`${match.url}/featured`} render={() => <GamesFiltered featured={true} explicitFeatured={true} />} />
                    <Route exact path={`${match.url}/all`} render={() => <GamesFiltered featured={false} />} />
                </Switch>
            </div>
        );
    }
}

export default Games;
