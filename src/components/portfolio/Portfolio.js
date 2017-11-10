import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table from './Table';
import PaginatedAxiosDataProvider from './PaginatedDataProvider';
import FilterForm from "../games/FilterForm";
import FilterManager from './../../FilterManager';
import Games from './../../data/model/Games';

class Portfolio extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filter: {}
        };

        this.setFilter = this.setFilter.bind(this);
    }
    componentWillMount(){
        var filterManager = this.filterManager = new FilterManager(this.context.router, {
            basePath: '/portfolio'
        });

        filterManager.registerFilterUpdateCallback(this.setFilter);
        filterManager.assume({
            featured: false,
            queryString: this.props.location.search
        });
    }
    setFilter(filter) {
        this.setState({filter: filter});
    }
    render() {
        var self = this;

        var getParams = function() {
            var filter = self.state.filter;
            return {
                q: filter.searchQuery,
                featured: (filter.featured) ? 1 : 0,
                category: filter.category,
                jurisdiction: filter.jurisdiction,
                studio: filter.studio,
                channel: filter.channel,
                sort: filter.sort ? filter.sort : 'name',
                order: filter.order ? filter.order : 'asc'
            };
        };

        var games = new Games();
        var dataProvider = new PaginatedAxiosDataProvider({
            itemsPerPage: 75,
            getPage: function(page, itemsPerPage){

                var requestParams = getParams();
                requestParams.page = page;
                requestParams.itemsPerPage = itemsPerPage;

                return games.all({
                    params: requestParams
                }).then((data) => {
                    return { items: data.games, total: data.meta.total };
                });
            }
        });

        return (
            <div className="page-portfolio">
                <FilterForm filter={this.state.filter} filterManager={this.filterManager} />
                <Table dataProvider={ dataProvider } />
            </div>
        );
    }
}

Portfolio.contextTypes = {
    router: PropTypes.object
};

export default Portfolio;
