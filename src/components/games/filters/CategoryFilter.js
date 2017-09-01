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

        this.onChangeHandler = this.onChangeHandler.bind(this);
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
    onChangeHandler(value) {
        var categoryId = (value.id === '*')? null : value.id;
        this.props.setFilter({ category: categoryId });
    }
    render() {
        const category = this.props.category? this.props.category : [];
        const options = [{id: '*', name: 'All Categories'}, ...this.state.options];

        return (
            <fieldset>
                <label>Category:</label>
                <DropdownList
                    value={category}
                    data={ options }
                    valueField="id"
                    textField="name"
                    onChange={ this.onChangeHandler }
                    disabled={ this.props.disabled }
                />
            </fieldset>
        );
    }
}

export default CategoryFilter;