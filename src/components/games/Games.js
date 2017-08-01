import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import GamesFiltered from './GamesFiltered';
import './Games.css';

class Games extends Component {
    render() {
        const props = this.props;
        const match = props.match;
        return (
            <div>
                <Switch>
                    <Route exact path={`${match.url}/all`} render={() => <GamesFiltered {...props} featured={false} explicitFeatured={false} />} />
                    <Route exact path={`${match.url}/featured`} render={() => <GamesFiltered {...props} featured={true} explicitFeatured={true} />} />
                    <Route exact path={match.url} render={() => <GamesFiltered {...props} featured={true} explicitFeatured={false} />} />
                </Switch>
            </div>
        );
    }
}

export default Games;
