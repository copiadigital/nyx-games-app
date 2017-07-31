import React, { Component } from 'react';
import { Multiselect } from 'react-widgets';
import categories from '../../../data/categories';
import 'react-widgets/dist/css/react-widgets.css';

class ChannelFilter extends Component {
    render() {
        const channel = this.props.channel? this.props.channel : [];
        const channels = [
            { id: 'desktop', name: 'Desktop' },
            { id: 'mobile', name: 'Mobile' },
        ];

        return (
            <fieldset>
                <label>Channel:</label>
                <Multiselect
                    value={channel}
                    data={channels}
                    valueField="id"
                    textField="name"
                    onChange={ (value) => this.props.setFilter({ channel: value.map(function(a){ return a.id }) }) }
                />
            </fieldset>
        );
    }
}

export default ChannelFilter;