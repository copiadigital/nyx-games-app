import React, { Component } from 'react';
import ChannelList from "../utilities/ChannelList";
import LinkButton from "../utilities/LinkButton";
import queryString from 'query-string';

class DemoModal extends Component {
    constructor(props){
        super(props);

        this.state = {
        };
    }
    buildDemoUrl() {
        const game = this.props.game;
        const channel = this.props.channel;

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

        return 'https://nogs-gl-stage.nyxmalta.com/game/?' + queryString.stringify({
                nogsoperatorid: 894,
                nogsgameid: game.id,
                nogsmode: 'demo',
                nogslang: 'en_us',
                nogscurrency: 'EUR',
                clienttype: clientType
            });
    }
    render() {
        const game = this.props.game;
        const channel = this.props.channel;

        var maxWidth = Math.min(window.innerWidth * 0.9, 1280);
        var detailWidth = Math.max(100, maxWidth * 0.25);
        var viewportWidth = maxWidth - detailWidth;
        var viewportHeight = viewportWidth * (600/960);

        return (
            <div className="game-demo-container">
                <div className="game-demo-close" onClick={this.props.closeDemoModal}>x</div>
                <div className="game-demo-viewport" style={ { width: viewportWidth, height: viewportHeight  } }>
                    <iframe src={this.buildDemoUrl()} width="100%" height="100%" title={`${game.name} ${channel} demo`}></iframe>
                </div>
                <div className="game-demo-detail" style={ { width: detailWidth } }>
                    <div className="game-demo-title">{game.name}</div>
                    <p className="game-demo-description">{game.description}</p>
                    <dl>
                        <dt>Channel</dt><dd><ChannelList channels={game.channels} glue=" | " /></dd>
                        <dt>Lines</dt><dd>##</dd>
                        <dt>RTP</dt><dd>##%</dd>
                        <dt>Volatility</dt><dd>???????</dd>
                    </dl>
                    <LinkButton className="btn-blue" to={`/game/${game.id}/${game.slug}`}>View game info</LinkButton>
                </div>
            </div>
        )
    }
}

export default DemoModal;
