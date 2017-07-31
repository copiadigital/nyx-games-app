import React, { Component } from 'react';
import GameList from './GameList';
import FilterForm from "./FilterForm";
import queryString from 'query-string';
import update from 'immutability-helper';
import PropTypes from 'prop-types';

var queryStringOptions = {
    arrayFormat: 'bracket'
};

class GamesFiltered extends Component {
    constructor(props) {
        super(props);

        var filter = this.buildFilter();

        this.state = {
            filter: filter
        };

        this.setFilter = this.setFilter.bind(this);
    }
    setFilter(data) {
        if(data.featured){
            data.explicitFeatured = true;
        }

        var filter = update(this.state.filter, { $merge: data });
        var newUrl = this.buildUrl(filter);

        this.context.router.history.push(newUrl);
        this.setState({ filter: filter });
    }
    buildFilter(){
        var filter = {
            featured: (this.props.featured),
            explicitFeatured: (this.props.explicitFeatured)
        };

        var queryParams = queryString.parse(this.props.location.search, queryStringOptions);
        filter['category'] = queryParams.category;
        filter['channel'] = queryParams.channel;
        filter['jurisdiction'] = queryParams.jurisdiction;
        filter['provider'] = queryParams.provider;

        return filter;
    }
    buildUrl(filter) {
        var path = '/games/' + ((filter.featured && filter.explicitFeatured)? 'featured' : 'all');
        var query = queryString.stringify({
            category: filter.category,
            channel: filter.channel,
            jurisdiction: filter.jurisdiction,
            provider: filter.provider
        }, queryStringOptions);

        return path + '?' + query;
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
