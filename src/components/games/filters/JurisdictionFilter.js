import React, { Component } from 'react';
import jurisdictions from '../../../data/jurisdictions';
import 'react-widgets/dist/css/react-widgets.css';
import CheckboxMultiselect from "./CheckboxMultiselect";

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
    renderListItem(options){
        const checked = (options.item.selected);

        return (
            <span>
                <input type="checkbox" checked={checked} />
                <span>{options.text} {checked}</span>
          </span>
        );
    }
    render() {
        const jurisdiction = this.props.jurisdiction? this.props.jurisdiction : [];

        return (
            <fieldset>
                <label>Jurisdiction:</label>
                <CheckboxMultiselect
                    allOption="All jurisdictions"
                    value={jurisdiction}
                    data={this.state.options}
                    valueField="id"
                    textField="name"
                    placeholder="Select..."
                    onChange={ (values) => this.props.setFilter({ jurisdiction: values }) }
                    disabled={ this.props.disabled }
                    itemComponent={this.renderListItem}
                />
            </fieldset>
        );
    }
}

export default JurisdictionFilter;