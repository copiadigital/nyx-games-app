import React, { Component } from 'react';
import ReactGA from 'react-ga';
import queryString from 'query-string';

class DemoIFrame extends Component {
    constructor(props){
        super(props);

        this.state = {
        };
    }
    componentDidMount(){
        ReactGA.event({
            category: 'Game',
            action: 'Play demo ' + this.getClientType(this.props.channel),
            label: 'ID:' + this.props.game.id
        });
    }
    getClientType(channel){
        var clientType = 'flash';

        switch(channel){
            case 'html5':
            case 'mobile':
                clientType = 'html5';
                break;
            case 'desktop':
            case 'flash':
            default:
                clientType = 'flash';
                break;
        }

        return clientType;
    }
    buildDemoUrl() {
        const game = this.props.game;
        const channel = this.props.channel;

        var clientType = this.getClientType(channel);

        return 'https://nogs-gl-stage.nyxmalta.com/game/?' + queryString.stringify({
                nogsoperatorid: 241,
                nogsgameid: game.id,
                nogsmode: 'demo',
                nogslang: 'en_us',
                nogscurrency: 'USD',
                clienttype: clientType
            });
    }
    render() {
        const game = this.props.game;
        const channel = this.props.channel;

        return <iframe className="gameContent" src={this.buildDemoUrl()} width="100%" height="100%" title={`${game.name} ${channel} demo`}></iframe>
    }
}

export default DemoIFrame;
