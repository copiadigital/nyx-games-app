import React, { Component } from 'react';
import './Service.css';

class Service extends Component {
    render() {
        return (
            <div className="page-service">
                <p className="info">
                    <span className="icon icon--info">&nbsp;</span>
                    The NYX Games Service Desk is available to our customers as a self service tool for ordering games, modifying game configurations, submitting various other requests and tracking request progress. Please contact <a href="mailto:sales@nyxgg.com">sales@nyxgg.com</a> to learn more!
                </p>
                <iframe src="https://gamesdesk.nyxgg.com/" width="100%" height="1200" title="Self service" />
            </div>
        );
    }
}

export default Service;
