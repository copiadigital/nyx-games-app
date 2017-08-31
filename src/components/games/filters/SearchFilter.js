import React, { Component } from 'react';

class SearchFilter extends Component {
    constructor(props) {
        super(props);
        this.handleInputKeyUp = this.handleInputKeyUp.bind(this);
    }
    handleInputKeyUp(event) {
        const value = event.target.value;
        const minLength = (this.props.minLength)? +this.props.minLength : 0;
        const query = (value.length > minLength)? value : null;

        if(query !== this.props.defaultValue) {
            this.props.setFilter({searchQuery: query});
        }
    }
    render() {
        return (
            <input type="text" id="search" ref="searchInput" placeholder="Search" defaultValue={ this.props.defaultValue } onKeyUp={ this.handleInputKeyUp } />
        );
    }
}

export default SearchFilter;