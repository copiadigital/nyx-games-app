import React, { Component } from 'react';
import { Multiselect } from 'react-widgets';
import jurisdictions from '../../../data/jurisdictions';
import 'react-widgets/dist/css/react-widgets.css';

class JurisdictionFilter extends Component {
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

        jurisdictions.all({
            params: {
                itemsPerPage: 100,
                sort: 'name'
            }
        })
            .then((res) => {
                this.setState({
                    loading: false,
                    options: res.data.jurisdictions
                });
            });
    }
    render() {
        const jurisdiction = this.props.jurisdiction? this.props.jurisdiction : [];

        return (
            <fieldset>
                <label>Jurisdiction:</label>
                <Multiselect
                    value={jurisdiction}
                    data={this.state.options}
                    valueField="id"
                    textField="name"
                    placeholder="Select.."
                    onChange={ (value) => this.props.setFilter({ jurisdiction: value.map(function(a){ return a.id }) }) }
                    disabled={ this.props.disabled }
                />
            </fieldset>
        );
    }
}

export default JurisdictionFilter;