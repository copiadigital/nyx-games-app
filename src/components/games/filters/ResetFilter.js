import React, { Component } from 'react';

class ResetFilter extends Component {
    constructor(props){
        super(props);
        this.onReset = this.onReset.bind(this);
    }
    onReset(e){
        this.reset();
        e.preventDefault();
    }
    reset(){
        this.props.reset();
    }
    render() {
        return (
            <div className="filter-reset">
                <a href="#" className="reset" onClick={this.onReset}>Reset Filters</a>
            </div>
        );
    }
}

export default ResetFilter;