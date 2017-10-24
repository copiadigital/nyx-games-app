import React, { Component } from 'react';

class Download extends Component {
    render() {
        return (
            <li><a href={this.props.href} target="_blank">{this.props.title}</a></li>
        );
    }
}

export default Download;