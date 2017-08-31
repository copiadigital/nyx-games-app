import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class ResetFilter extends Component {
    render() {
        return (
            <div className="filter-reset">
                <Link to="/games" className="reset">Reset Filters</Link>
            </div>
        );
    }
}

export default ResetFilter;