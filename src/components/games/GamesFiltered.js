import React, { Component } from 'react';
import GameList from './GameList';
import FilterForm from "./FilterForm";
import update from 'immutability-helper';
import PropTypes from 'prop-types';

class GamesFiltered extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filter: {
                featured: (props.featured),
                explicitFeatured: (props.explicitFeatured)
            }
        };

        this.setFilter = this.setFilter.bind(this);
    }
    setFilter(data) {
        var filter = update(this.state.filter, { $merge: data });
        var path = '/games/' + ((this.filter.featured && this.filter.explicitFeatured)? 'featured' : 'all');

        this.context.router.history.push(path);
        this.setState({ filter: filter });
    }
    render() {
        return (
            <div>
                <FilterForm filter={this.state.filter} setFilter={this.setFilter} />
                <GameList filter={this.state.filter} />
            </div>
        );
    }
}

GamesFiltered.contextTypes = {
    router: PropTypes.object
};

export default GamesFiltered;
