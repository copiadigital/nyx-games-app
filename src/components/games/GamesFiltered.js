import React, { Component } from 'react';
import GameList from './GameList';
import FilterForm from "./FilterForm";
import queryString from 'query-string';
import update from 'immutability-helper';
import PropTypes from 'prop-types';
import _ from 'underscore';
import games from '../../data/games';

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
        this.openDemoModal = this.openDemoModal.bind(this);
        this.closeDemoModal = this.closeDemoModal.bind(this);
    }
    componentDidMount(){
        this.checkUrlForDemoModal(this.props);
    }
    componentWillReceiveProps(nextProps){
        var filter = this.buildFilter(nextProps);

        this.setState({
            filter: filter
        });

        this.checkUrlForDemoModal(nextProps);
    }
    setFilter(data) {
        // set explicitFeatured if we've just changed to featured or its already set
        // needed to switch to a list of all games on filter change, unless user has actually asked for featured games
        data.explicitFeatured = (this.state.filter.explicitFeatured || data.featured);

        var filter = update(this.state.filter, { $merge: data });
        this.updateUrl(filter, this.state.demoModal);
    }
    checkUrlForDemoModal(props){
        var hash = props.location.hash;
        var match = hash.match(/^#game([0-9]+)-([a-z]+)/i);
        if(match){
            games.getById(match[1])
                .then((res) => {
                    var game = res.data.game;

                    this.setState({
                        demoModal: {
                            game: game,
                            channel: match[2]
                        }
                    });
                });
        }else{
            this.setState({ demoModal: null });
        }
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
        filter['studio'] = queryParams.studio;
        filter['sort'] = queryParams.sort;
        filter['order'] = queryParams.order;

        return filter;
    }
    buildUrl(filter, demoModal) {
        var path, queryStringData;

        if(filter.searchQuery){
            path = '/games/all';
            queryStringData = {
                query: filter.searchQuery
            };
        }else {
            path = '/games/' + ((filter.featured && filter.explicitFeatured) ? 'featured' : ((filter.featured)? '' : 'all'));
            queryStringData = {
                category: filter.category,
                channel: filter.channel,
                jurisdiction: filter.jurisdiction,
                studio: filter.studio,
                sort: filter.sort,
                order: filter.order
            };
        }

        // remove null/undefined filters
        queryStringData = _.pick(queryStringData, function(val){
            return (_.isNull(val) === false && _.isUndefined(val) === false);
        });

        var query = queryString.stringify(queryStringData, queryStringOptions);
        var hash = (demoModal)? 'game' + demoModal.game.id + '-' + demoModal.channel : null;
        return path + '?' + query + (hash? '#' + hash : '');
    }
    updateUrl(filter, demoModal){
        var newUrl = this.buildUrl(filter, demoModal);
        this.context.router.history.push(newUrl);
    }
    openDemoModal(game, channel){
        this.setState({
             demoModal: {
                 game: game,
                 channel: channel
             }
        }, () => (this.updateUrl(this.state.filter, this.state.demoModal)));
    }
    closeDemoModal() {
        this.setState({
             demoModal: null
        }, () => (this.updateUrl(this.state.filter, this.state.demoModal)));
    }
    render() {
        return (
            <div>
                <FilterForm filter={this.state.filter} setFilter={this.setFilter} />
                <GameList filter={this.state.filter}
                          demoModal={this.state.demoModal}
                          openDemoModal={this.openDemoModal}
                          closeDemoModal={this.closeDemoModal}
                />
            </div>
        );
    }
}

GamesFiltered.contextTypes = {
    router: PropTypes.object
};

export default GamesFiltered;
