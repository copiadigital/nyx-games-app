import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class LinkButton extends Component {
    render() {
        const props = this.props;
        const className = 'btn' + (props.className? ' ' + props.className : null);

        return <Link {...props} className={className} />;
    }
}

export default LinkButton;