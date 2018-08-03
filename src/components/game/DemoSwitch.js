import React, { Component } from 'react';

class DemoSwitch extends Component {
    constructor(props){
        super(props);

        this.state = {};
        this.desktopOption = this.desktopOption.bind(this);
        this.mobileOption = this.mobileOption.bind(this);

        this.setChannel = this.props.setChannel.bind(this);
    }
    mobileOption() {
        this.setChannel('mobile');

    }
    desktopOption() {
        this.setChannel('desktop');
    }

    render() {
        const game = this.props.game;
        const channel = this.props.channel;

        var desktopClasses = ['game-demo-switch-choice', 'game-demo-switch-choice__desktop'];
        var mobileClasses = ['game-demo-switch-choice', 'game-demo-switch-choice__mobile'];

        if(channel === 'desktop'){
            desktopClasses.push('active');
        }else if(channel === 'mobile'){
            mobileClasses.push('active');
        }

        return (
            <div className="game-demo-switch-button-container">
                { ( (game.channels.indexOf('desktop') > -1) ? <button className={ desktopClasses.join(' ') } onClick={this.desktopOption}>Desktop</button> : '' ) }
                { ( (game.channels.indexOf('mobile') > -1) ? <button className={ mobileClasses.join(' ') } onClick={this.mobileOption}>Mobile</button> : '') }
            </div>
        );
    }
}

export default DemoSwitch;
