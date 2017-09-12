import React, { Component } from 'react';
import './Service.css';

class Service extends Component {
    constructor(props){
        super(props);
        //this.startPollHeight = this.startPollHeight.bind(this);
    }
    render() {
        return (
            <div className="page-service">
                <iframe src="https://gamesdesk.nyxgg.com/" width="100%" height="600" title="Self service" />
            </div>
        );
    }
}

export default Service;
