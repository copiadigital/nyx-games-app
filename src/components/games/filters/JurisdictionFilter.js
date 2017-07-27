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
        const jurisdictions = this.props.jurisdictions? this.props.jurisdictions : [];
        const options = [
            { id: 'featured', name: 'Featured' },
            { id: 'all', name: 'All' }
        ];

        return (
            <fieldset>
                <label>Jurisdiction:</label>
                <Multiselect
                    value={jurisdictions}
                    data={this.state.options}
                    valueField="id"
                    textField="name"
                    onChange={ (value) => console.log('juri', value) /* this.props.setFilter({ jurisdictions: value.map(function(a){ return a.id }) }) */ }
                />
            </fieldset>
        );
    }
}

export default JurisdictionFilter;