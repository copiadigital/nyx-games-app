import React, { Component } from 'react';
import { DropdownList } from 'react-widgets';
import 'react-widgets/dist/css/react-widgets.css';

class FeaturedFilter extends Component {
    render() {
        const featured = (this.props.featured);
        const options = [
            { id: 'featured', name: 'Featured' },
            { id: 'all', name: 'All' }
        ];

        return (
            <DropdownList
                value={featured? 'featured' : 'all' }
                data={options}
                valueField="id"
                textField="name"
                onChange={(value) => this.props.setFilter({ featured: (value.id === 'featured') })}
            />
        );
    }
}

export default FeaturedFilter;