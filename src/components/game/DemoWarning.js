import React, { Component } from 'react';


class DemoWarning extends Component {
    constructor(props){
        super(props);

        this.state = {};

        this.demoModal = this.props.demoModal;

        this.rejectWarning = this.rejectWarning.bind(this);
        this.acceptWarning  = this.acceptWarning.bind(this);
    }
    rejectWarning() {
        this.demoModal.setWarningAccepted('no');
    }
    acceptWarning() {
        this.demoModal.setWarningAccepted('yes');
    }
    render() {
        return (<div className="warningWindow">
        <h1 className="warningHeading">Over 18s Only</h1>
        <p className="warningMessage">As a trusted partner to the world’s most respected iGaming, iLottery and Sports Betting brands, SG Digital is fully committed to operating in a responsible and compliant manner.
The content you are accessing is intended only for individuals 18 years or older. To proceed, please confirm that you meet the legal age requirements below.</p>
        <button className="warningButton" onClick={this.acceptWarning}>I'm 18+</button>
        <button className="warningButton" onClick={this.rejectWarning}>I'm under 18</button>
        </div>)
    }
}

export default DemoWarning;