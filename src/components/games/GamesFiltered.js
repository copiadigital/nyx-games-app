import React, { Component } from 'react';
import GameList from './GameList';
import FilterForm from "./FilterForm";
import queryString from 'query-string';
import update from 'immutability-helper';
import PropTypes from 'prop-types';
import _ from 'underscore';

var queryStringOptions = {
    arrayFormat: 'bracket'
};

class GamesFiltered extends Component {
    constructor(props) {
        super(props);

        var filter = this.buildFilter(props);

        this.state = {
            filter: filter
        };

        this.setFilter = this.setFilter.bind(this);
    }
    componentWillReceiveProps(nextProps){
        var filter = this.buildFilter(nextProps);
        this.setState({ filter: filter });
    }
    setFilter(data) {
        // set explicitFeatured if we've just changed to featured or its already set
        // needed to switch to a list of all games on filter change, unless user has actually asked for featured games
        data.explicitFeatured = (this.state.filter.explicitFeatured || data.featured);

        var filter = update(this.state.filter, { $merge: data });
        var newUrl = this.buildUrl(filter);

        this.context.router.history.push(newUrl);
    }
    buildFilter(props){
        var filter = {
            featured: (props.featured),
            explicitFeatured: (props.explicitFeatured)
        };

        var queryParams = queryString.parse(props.location.search, queryStringOptions);
        filter['searchQuery'] = queryParams.query;
        filter['category'] = queryParams.category;
        filter['channel'] = queryParams.channel;
        filter['jurisdiction'] = queryParams.jurisdiction;
        filter['provider'] = queryParams.provider;
        filter['sort'] = queryParams.sort;
        filter['order'] = queryParams.order;

        return filter;
    }
    buildUrl(filter) {
        var path, queryStringData;

        if(filter.searchQuery){
            path = '/games/all';
            queryStringData = {
                query: filter.searchQuery
            };
        }else {
            path = '/games/' + ((filter.featured && filter.explicitFeatured) ? 'featured' : 'all');
            queryStringData = {
                category: filter.category,
                channel: filter.channel,
                jurisdiction: filter.jurisdiction,
                provider: filter.provider,
                sort: filter.sort,
                order: filter.order
            };
        }

        // remove null/undefined filters
        queryStringData = _.pick(queryStringData, function(val){
            return (_.isNull(val) === false && _.isUndefined(val) === false);
        });

        var query = queryString.stringify(queryStringData, queryStringOptions);
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
