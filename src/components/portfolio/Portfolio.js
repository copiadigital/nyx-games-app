import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table from './Table';
import PaginatedAxiosDataProvider from './PaginatedDataProvider';
import FilterForm from "../games/FilterForm";
import FilterManager from './../../FilterManager';
import Games from './../../data/model/Games';
import './Portfolio.css';

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
                <div className="portfolio-table-container">
                    <Table
                        dataProvider={ dataProvider }
                        tableHeadRow={ GameTableHeadRow }
                        tableRow={ GameTableRow }
                        className="portfolio"
                    />
                </div>
            </div>
        );
    }
}

Portfolio.contextTypes = {
    router: PropTypes.object
};

class GameTableHeadRow extends Component {
    render(){
        return (
            <tr>
                <th><div><span>Game name</span></div></th>
                <th><div><span>Branded</span></div></th>
                <th><div><span>Premium</span></div></th>
                <th><div><span>Jackpot</span></div></th>
                <th><div><span>Channel</span></div></th>
                <th><div><span>Game type</span></div></th>
                <th><div><span>Game model</span></div></th>
                <th><div><span>Studio</span></div></th>
                <th><div><span>Game ID</span></div></th>
                <th><div><span>RTP %</span></div></th>
                <th><div><span>Max exposure (inc. feature)</span></div></th>
                <th><div><span>Min bet</span></div></th>
                <th><div><span>Max bet</span></div></th>
                <th><div><span>Volatility</span></div></th>
                <th><div><span>Free rounds</span></div></th>
                <th className="jurisdiction rotate"><div><span>Aldeney</span></div></th>
            </tr>
        );
    }
}

class GameTableRow extends Component {
    render(){
        var props = this.props;
        var data = props.data;
        return (
            <tr style={ { height: props.rowHeight } }>
                <td>{ data.name }</td>
                <td>{ data.brand_licensed }</td>
                <td>{ data.high_quality }</td>
                <td>{ data.jackpot_enabled }</td>
                <td>{ data.channels.sort().map(uppercaseFirst).join(', ') }</td>
                <td>{ uppercaseFirst(data.category) }</td>
                <td>{ uppercaseFirst(data.model) }</td>
                <td>{ data.studio.name }</td>
                <td>{ data.id }</td>
                <td>{ data.rtp.toFixed(2) }</td>
                <td>{ data.max_exposure }</td>
                <td>{ data.min_bet }</td>
                <td>{ data.max_bet }</td>
                <td>{ data.volatility }</td>
                <td>{ data.freerounds_enabled }</td>

            </tr>
        );
    }
}

function uppercaseFirst(input){
    var string = input.toString();
    return string[0].toUpperCase() + string.substr(1);
}

export default Portfolio;
