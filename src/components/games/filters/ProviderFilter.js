import React, { Component } from 'react';
import { Multiselect } from 'react-widgets';
import providers from '../../../data/providers';
import 'react-widgets/dist/css/react-widgets.css';

class ProviderFilter extends Component {
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
    render() {
        // force to number for strict matching
        const provider = this.props.provider? this.props.provider.map(num => Math.floor(num)) : [];

        return (
            <fieldset>
                <label>Studio:</label>
                <Multiselect
                    value={provider}
                    data={this.state.options}
                    valueField="id"
                    textField="name"
                    onChange={ (value) => this.props.setFilter({ provider: value.map(function(a){ return +a.id }) }) }
                />
            </fieldset>
        );
    }
}

export default ProviderFilter;