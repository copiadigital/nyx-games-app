import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table from './Table';
import PaginatedAxiosDataProvider from './PaginatedAxiosDataProvider';
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
        var games = new Games();
        var dataProvider = new PaginatedAxiosDataProvider(games, {
            responseParse: function(data){
                return { items: data.games, total: data.meta.total };
            }
        });

        return (
            <div className="page-portfolio">
                <FilterForm filter={this.state.filter} filterManager={this.filterManager} />
                <Table filter={this.state.filter} dataProvider={ dataProvider } />
            </div>
        );
    }
}

Portfolio.contextTypes = {
    router: PropTypes.object
};

export default Portfolio;
