import React, { Component } from 'react';
import _ from 'underscore';

class SearchFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.value
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.updateSearchQueryDebounced = _.debounce(this.updateSearchQuery, 500);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({value: nextProps.value});
    }
    handleInputChange(event) {
        const value = event.target.value;
        this.setState({ value: value });
        this.updateSearchQueryDebounced(value);
    }
    updateSearchQuery(value) {
        const minLength = (this.props.minLength)? +this.props.minLength : 0;
        if(value.length === 0 || value.length >= minLength) {
            this.props.setFilter({searchQuery: value});
        }
    }
    render() {
        const value = (this.state.value)? this.state.value : '';

        return (
            <input type="text" id="search" ref="searchInput" placeholder="Search" value={ value } onChange={ this.handleInputChange } />
        );
    }
}

export default SearchFilter;