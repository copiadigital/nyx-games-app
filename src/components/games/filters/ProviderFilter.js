import React, { Component } from 'react';
import { DropdownList } from 'react-widgets';
import providers from '../../../data/providers';
import 'react-widgets/dist/css/react-widgets.css';

class ProviderFilter extends Component {
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

        providers.all({
            params: {
                itemsPerPage: 100,
                sort: 'name'
            }
        })
            .then((res) => {
                this.setState({
                    loading: false,
                    options: res.data.providers
                });
            });
    }
    onChangeHandler(value) {
        var providerId = (value.id === '*')? null : value.id;
        this.props.setFilter({ provider: providerId });
    }
    render() {
        // force to number for strict matching
        const provider = this.props.provider? Number(this.props.provider) : null;
        const options = [{id: '*', name: 'All Studios'}, ...this.state.options];

        return (
            <fieldset>
                <label>Studio:</label>
                <DropdownList
                    value={provider}
                    data={options}
                    valueField="id"
                    textField="name"
                    onChange={ this.onChangeHandler }
                />
            </fieldset>
        );
    }
}

export default ProviderFilter;