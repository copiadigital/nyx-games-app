import React, { Component } from 'react';
import FeaturedFilter from './filters/FeaturedFilter';

class FilterForm extends Component {
    render() {
        return (
            <div>
                <FeaturedFilter
                    featured={ this.props.featured }
                    setFilter={ this.props.setFilter }
                />
            </div>
        );
    }
}

export default FilterForm;