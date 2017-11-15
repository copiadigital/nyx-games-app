import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FilterForm from "../games/FilterForm";
import FilterManager from './../../FilterManager';
import PortfolioTable from "./PortfolioTable";
import _ from 'underscore';
import LinkButton from "../utilities/LinkButton";

class Portfolio extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filter: {}
        };

        this.onViewAll = this.onViewAll.bind(this);
        this.setFilter = this.setFilter.bind(this);
    }
    componentWillMount(){
        var filterManager = this.filterManager = new FilterManager(this.context.router, {
            basePath: function(filter, queryParams){
                if(filter.searchQuery){
                    return '/portfolio/all';
                }else {
                    // remove featured from query params, as it will be in the URL
                    queryParams.featured = null;

                    // adjust the URL based on featured
                    var hasFilters = filterManager.hasFilters(filter);
                    return '/portfolio/' + ((filter.featured && filter.explicitFeatured) ? 'featured' : ((filter.featured && !hasFilters)? '' : 'all'));
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
    shouldComponentUpdate(nextProps, nextState){
        var differentFilter = (!_.isEqual(this.state.filtes,  nextState.filter));
        return differentFilter;
    }
    setFilter(filter) {
        this.setState({filter: filter});
    }
    onViewAll(e){
        e.preventDefault();
        this.filterManager.setFilter({ featured: false });
    }
    render() {
        return (
            <div className="page-portfolio">
                <FilterForm filter={this.state.filter} filterManager={this.filterManager} />
                <div className="portfolio-table-container">
                    <PortfolioTable filter={this.state.filter} />
                </div>

                { (this.state.filter.featured) ? <LinkButton to="/portfolio/all" className="button button--regular" onClick={this.onViewAll}>View all games</LinkButton> : null }
            </div>
        );
    }
}

Portfolio.contextTypes = {
    router: PropTypes.object
};

export default Portfolio;
