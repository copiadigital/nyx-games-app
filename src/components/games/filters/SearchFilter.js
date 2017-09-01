import React, { Component } from 'react';

class SearchFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.value
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({value: nextProps.value});
    }
    handleInputChange(event) {
        const value = event.target.value;
        const minLength = (this.props.minLength)? +this.props.minLength : 0;
        const query = (value.length > minLength)? value : null;

        if(query !== this.state.value) {
            this.props.setFilter({searchQuery: query});
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