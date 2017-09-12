import React, { Component } from 'react';
import './Service.css';

class Service extends Component {
    constructor(props){
        super(props);
        //this.setChannel = this.setChannel.bind(this);
    }
    render() {
        var maxWidth = Math.min(window.innerWidth, 960);
        var viewportWidth = maxWidth;
        var viewportHeight = viewportWidth * (600/960);

        return (
            <div className="page-service">
                <iframe src="https://gamesdesk.nyxgg.com/" width="100%" height="600" border="0" />
            </div>
        );
    }
}

export default Service;
