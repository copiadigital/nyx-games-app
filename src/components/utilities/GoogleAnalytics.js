import React, { Component } from 'react';
import ReactGA from 'react-ga';
import PropTypes from 'prop-types';

class GoogleAnalytics extends Component {
    static contextTypes = {
        router: PropTypes.object
    };

    constructor(props){
        super(props);

        this.onHistoryChange = this.onHistoryChange.bind(this);
    }

    componentDidMount() {
        // listen for history changes
        this.context.router.history.listen(this.onHistoryChange);

        // track current page
        this.trackPath(this.context.router.route.location.pathname);
    }

    componentWillMount() {
        ReactGA.initialize(process.env.REACT_APP_GA_PROPERTY_ID);
    }

    onHistoryChange(state){
        // do something interesting
        this.trackPath(state.pathname);
    }

    trackPath(path){
        console.log('track pageview', path);
        ReactGA.pageview(path);
    }

    render() {
        return null;
    }
}

export default GoogleAnalytics;