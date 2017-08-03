import React, { Component } from 'react';
import { DropdownList } from 'react-widgets';
import categories from '../../../data/categories';
import 'react-widgets/dist/css/react-widgets.css';

class CategoryFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            options: []
        };
    }
    componentDidMount() {
        this.loadOptions(this.props);
    }
    loadOptions(props) {
        this.setState({ loading: true });

        categories.all({
            params: {
                itemsPerPage: 100,
                sort: 'name'
            }
        })
            .then((res) => {
                this.setState({
                    loading: false,
                    options: res.data.categories
                });
            });
    }
    render() {
        const category = this.props.category? this.props.category : [];

        return (
            <fieldset>
                <label>Category:</label>
                <DropdownList
                    value={category}
                    data={this.state.options}
                    valueField="id"
                    textField="name"
                    onChange={ (value) => this.props.setFilter({ category: value.id }) }
                />
            </fieldset>
        );
    }
}

export default CategoryFilter;