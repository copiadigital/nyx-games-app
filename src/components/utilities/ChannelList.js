import React, { Component } from 'react';

class ChannelList extends Component {
    render() {
        const glue = this.props.glue ? this.props.glue : ' | ';

        const channels = this.props.channels.map(function(channel){
            console.log('channel', channel, channel.substring(0, 1).toUpperCase(), channel.substring(1));
            return channel.substring(0, 1).toUpperCase() + channel.substring(1);
        });

        return (
            <span>
                { channels.join(glue) }
            </span>
        );
    }
}

export default ChannelList;