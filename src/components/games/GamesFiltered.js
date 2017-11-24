import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GameList from './GameList';
import FilterForm from "./FilterForm";
import Games from './../../data/model/Games';
import FilterManager from './../../FilterManager';
import LinkButton from "../utilities/LinkButton";

class GamesFiltered extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filter: {}
        };

        this.gamesModel = new Games();

        this.setFilter = this.setFilter.bind(this);
        this.openDemoModal = this.openDemoModal.bind(this);
        this.closeDemoModal = this.closeDemoModal.bind(this);
        this.onViewAll = this.onViewAll.bind(this);
    }
    componentWillMount(){
        var filterManager = this.filterManager = new FilterManager(this.context.router, {
            basePath: function(filter, queryParams){
                if(filter.searchQuery){
                    return '/games/all';
                }else {
                    // remove featured from query params, as it will be in the URL
                    queryParams.featured = null;

                    // adjust the URL based on featured
                    var hasFilters = filterManager.hasFilters(filter);
                    return '/games/' + ((filter.featured && filter.explicitFeatured) ? 'featured' : ((filter.featured && !hasFilters)? '' : 'all'));
                }
            }
        });

        filterManager.registerFilterUpdateCallback(this.setFilter);
        filterManager.assume({
            featured: this.props.featured,
            explicitFeatured: this.props.explicitFeatured,
            queryString: this.props.location.search
        });
    }
    componentDidMount(){
        this.checkUrlForDemoModal(this.props);
    }
    componentWillReceiveProps(nextProps){
        this.checkUrlForDemoModal(nextProps);
    }
    setFilter(filter) {
        this.setState({filter: filter});
    }
    checkUrlForDemoModal(props){
        var hash = props.location.hash;
        var match = hash.match(/^#game([0-9]+)-([a-z]+)/i);
        if(match){
            this.gamesModel.getById(match[1])
                .then((data) => {
                    var game = data.game;

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
    updateUrl(filter, demoModal){
        var filterUrl = this.filterManager.buildUrl(filter);
        var hash = (demoModal)? 'game' + demoModal.game.id + '-' + demoModal.channel : null;
        var newUrl = filterUrl + (hash? '#' + hash : '');
        this.context.router.history.push(newUrl);
    }
    onViewAll(e){
        e.preventDefault();
        this.filterManager.setFilter({ featured: false });
    }
    render() {
        return (
            <div>
                <FilterForm filter={this.state.filter} filterManager={this.filterManager} />
                <GameList filter={this.state.filter}
                          demoModal={this.state.demoModal}
                          openDemoModal={this.openDemoModal}
                          closeDemoModal={this.closeDemoModal}
                />

                { (this.state.filter.featured) ? <LinkButton to="/games/all" className="btn--regular" onClick={this.onViewAll}>View all games</LinkButton> : null }
            </div>
        );
    }
}

GamesFiltered.contextTypes = {
    router: PropTypes.object
};

export default GamesFiltered;
