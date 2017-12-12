import React, { Component } from 'react';
import Table from './Table';
import PaginatedAxiosDataProvider from './PaginatedDataProvider';
import Games from './../../data/model/Games';
import jurisdictions from './../../data/jurisdictions';
import Loading from "../utilities/Loading";
import ErrorModal from "../utilities/ErrorModal";
import _ from 'underscore';

class PortfolioTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hasError: false,
            jurisdictions: null
        };

    }
    componentWillMount(){
        //this.loadJurisdictions();
        this.setState({ jurisdictions: [] });
    }

    componentWillReceiveProps(nextProps){
        this.getDataProvider().reset();
    }

    loadJurisdictions(){
        jurisdictions.all({
            params: {
                itemsPerPage: 100,
                sort: 'name'
            }
        }).then((res) => {
            this.setState({
                jurisdictions: res.data.jurisdictions
            });
        }).catch((err) => {
            this.setState({ hasError: true });
        });
    }

    renderChannels(data){
        var children = data.channels.sort().map(function(channel){
            var title = uppercaseFirst(channel);
            return <span key={channel} className={"icon icon--channel-" + channel} title={ title }>{ title }</span>;
        });

        return React.createElement('div', {}, children);
    }

    getDataProvider(){
        if(!this.dataProvider) {
            var self = this;

            var getParams = function() {
                var filter = self.props.filter;
                return {
                    q: filter.searchQuery,
                    featured: (filter.featured) ? 1 : 0,
                    category: filter.category,
                    jurisdiction: filter.jurisdiction,
                    studio: filter.studio,
                    channel: filter.channel,
                    sort: filter.sort ? filter.sort : 'released',
                    order: filter.order ? filter.order : 'desc'
                };
            };

            var games = new Games();
            this.dataProvider = new PaginatedAxiosDataProvider({
                itemsPerPage: 75,
                getPage: function (page, itemsPerPage) {

                    var requestParams = getParams();
                    requestParams.page = page;
                    requestParams.itemsPerPage = itemsPerPage;

                    return games.all({
                        params: requestParams
                    }).then((data) => {
                        return {items: data.games, total: data.meta.total};
                    }).catch((err) => {
                        self.setState({ hasError: true });
                    });
                }
            });
        }

        return this.dataProvider;
    }

    refreshPage(){
        window.location.reload();
    }

    render() {
        // needs to be shared to keep updates going through
        var dataProvider = this.getDataProvider();

        if(this.state.hasError){
            return <ErrorModal>
                <p>Ooops, we're having some trouble loading the data.</p>
                <button className="btn btn--small" onClick={this.refreshPage}>Try again</button>
            </ErrorModal>
        }

        if(this.state.jurisdictions === null){
            return <Loading />
        }

        var columns = [
            { id: 'name', width: 200, heading: 'Game name' },
            { id: 'gameId', width: 75, heading: 'Game ID', content: (data => { return data.id }) },
            { id: 'channel', width: 90, heading: 'Channel', content: this.renderChannels, className: 'channel' },
            { id: 'release_date', width: 100, heading: 'Release date', content: (data => { return data.released }) },
            { id: 'category', width: 90, heading: 'Game type', content: (data => { return uppercaseFirst(data.category); }) },
            { id: 'model', width: 90, heading: 'Game model', content: (data => { return uppercaseFirst(data.model); }) },
            { id: 'studio', width: 140, heading: 'Studio', content: (data => { return data.studio.name }) },
            { id: 'rtp', width: 75, heading: 'RTP %', content: (data => { return data.rtp.toFixed(2) + '%'; }) },
            { id: 'max_exposure', width: 75, heading: 'Max exposure' },
            { id: 'min_bet', width: 75, heading: 'Min bet' },
            { id: 'max_bet', width: 75, heading: 'Max bet' },
            { id: 'volatility', width: 75, heading: 'Volatility' },
            { id: 'freerounds_enabled', width: 75, heading: 'Free rounds' },
            { id: 'brand_licensed', width: 75, heading: 'Branded', headingClassName: 'center', className: 'tick', content: (data => { return booleanElse(data.brand_licensed) }) },
            { id: 'high_quality', width: 75, heading: 'Premium', headingClassName: 'center', className: 'tick', content: (data => { return booleanElse(data.high_quality) })  },
            { id: 'jackpot_enabled', width: 75, heading: 'Jackpot', headingClassName: 'center', className: 'tick', content: (data => { return booleanElse(data.jackpot_enabled) })  }
        ];

        var jurisdictions = this.state.jurisdictions;
        for(var i = 0; i < jurisdictions.length; i++){
            var jurisdiction = jurisdictions[i];

            var hasJurisdiction = function(data, column){
                return _.contains(_.pluck(data.jurisdictions, 'id'), column.jurisdiction) ? <span title={column.heading}>✔</span> : '';
            };

            columns.push({
                id: 'jurisdiction_' + jurisdiction.id,
                width: 25,
                heading: jurisdiction.name,
                headingClassName: 'jurisdiction rotate',
                className: 'tick',
                jurisdiction: jurisdiction.id,
                content: hasJurisdiction,
            });
        }

        return <Table
                    dataProvider={ dataProvider }
                    className="portfolio"
                    rowHeight={34}
                    rowsToRender={15}
                    rowBuffer={10}
                    columns={ columns }
                    fixedColumns={1}
                />
    }
}

function uppercaseFirst(input){
    var string = input.toString();
    return string[0].toUpperCase() + string.substr(1);
}

function booleanElse(input){
    var compare = input.toString().toLowerCase();
    if(compare === true || compare === 'true'){
        return '✔';
    }

    if(compare === false || compare === 'false'){
        return '';
    }

    return input;
}

export default PortfolioTable;
