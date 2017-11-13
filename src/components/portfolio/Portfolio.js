import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FilterForm from "../games/FilterForm";
import FilterManager from './../../FilterManager';
import './Portfolio.css';
import PortfolioTable from "./PortfolioTable";

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
    shouldComponentUpdate(nextProps, nextState){
        var differentFilter = (this.state.filter !== nextState.filter);
        return differentFilter;
    }
    setFilter(filter) {
        this.setState({filter: filter});
    }
    render() {
        return (
            <div className="page-portfolio">
                <FilterForm filter={this.state.filter} filterManager={this.filterManager} />
                <div className="portfolio-table-container">
                    <PortfolioTable filter={this.state.filter} />
                </div>
            </div>
        );
    }
}

Portfolio.contextTypes = {
    router: PropTypes.object
};

export default Portfolio;
