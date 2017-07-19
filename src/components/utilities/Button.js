import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Button extends Component {
    render() {
        const props = this.props;
        const className = 'btn' + (props.className? ' ' + props.className : null);

        return <Link {...props} className={className} />;
    }
}

export default Button;