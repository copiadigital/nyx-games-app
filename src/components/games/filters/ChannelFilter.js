import React, { Component } from 'react';
import 'react-widgets/dist/css/react-widgets.css';
import CheckboxMultiselect from "./CheckboxMultiselect";

class ChannelFilter extends Component {
    render() {
        const channel = this.props.channel? this.props.channel : []
        const channels = [
            { id: 'desktop', name: 'Desktop' },
            { id: 'mobile', name: 'Mobile' },
        ];

        return (
            <fieldset>
                <label>Channel:</label>
                <CheckboxMultiselect
                    allOption="All channels"
                    value={channel}
                    data={channels}
                    valueField="id"
                    textField="name"
                    placeholder="Select..."
                    onChange={ (values) => this.props.setFilter({ channel: values }) }
                    disabled={ this.props.disabled }
                    itemComponent={this.renderListItem}
                />
            </fieldset>
        );
    }
}

export default ChannelFilter;