import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import GameList from './GameList';

class Games extends Component {
    render() {
        const match = this.props.match;
        const featured = (this.props.featured);
        const explicitFeatured = (this.props.explicitFeatured);

        return (
            <div>
                <select></select>
                <GameList featured={featured} />
            </div>
        );
    }
}

export default Games;
