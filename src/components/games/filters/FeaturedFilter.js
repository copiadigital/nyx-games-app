import React, { Component } from 'react';
import { DropdownList } from 'react-widgets';
import 'react-widgets/dist/css/react-widgets.css';

class FeaturedFilter extends Component {
    render() {
        const featured = (this.props.featured);
        const options = [
            { id: 'all', name: 'All Games' },
            { id: 'featured', name: 'Featured Games' }
        ];

        return (
            <fieldset>
                <label>Games:</label>
                <DropdownList
                    value={featured? 'featured' : 'all' }
                    data={options}
                    valueField="id"
                    textField="name"
                    onChange={(value) => this.props.setFilter({ featured: (value.id === 'featured') })}
                />
            </fieldset>
        );
    }
}

export default FeaturedFilter;