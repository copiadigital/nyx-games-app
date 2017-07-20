import React, { Component } from 'react';
import GameList from './GameList';
import FilterForm from "./FilterForm";
import update from 'immutability-helper';
import PropTypes from 'prop-types';

class GamesFiltered extends Component {
    constructor(props) {
        super(props);

        this.filter = {
            featured: (props.featured)
        };

        this.setFilter = this.setFilter.bind(this);
    }
    setFilter(data) {
        this.filter = update(this.filter, { $merge: data });

        var path = '/games/' + (this.filter.featured? 'featured' : 'all');
        this.context.router.history.push(path);
    }
    render() {
        const featured = (this.props.featured);
        const explicitFeatured = (this.props.explicitFeatured);

        return (
            <div>
                <FilterForm featured={featured} explicitFeatured={explicitFeatured} setFilter={this.setFilter} />
                <GameList featured={featured} />
            </div>
        );
    }
}

GamesFiltered.contextTypes = {
    router: PropTypes.object
};

export default GamesFiltered;
