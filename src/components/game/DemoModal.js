import React, { Component } from 'react';
import ChannelList from "../utilities/ChannelList";
import LinkButton from "../utilities/LinkButton";
import DemoIFrame from "./DemoIFrame";
import DemoSwitch from "./DemoSwitch";

class DemoModal extends Component {
    constructor(props){
        super(props);

        this.state = {
            game: this.props.game,
            channel: this.props.channel
        };

        this.setChannel = this.setChannel.bind(this);
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            game: nextProps.game,
            channel: nextProps.channel,
        })
    }
    setChannel(channel) {
        this.props.openDemoModal(this.props.game, channel);
    }
    render() {
        const game = this.state.game;
        const channel = this.state.channel;

        var maxWidth = Math.min(window.innerWidth * 0.9, 1280);
        var detailWidth = Math.max(100, maxWidth * 0.25);
        var viewportWidth = maxWidth - detailWidth;
        var viewportHeight = viewportWidth * (600/960);

        return (
            <div className="game-demo-modal-container">
                <div className="game-demo-modal-close" onClick={this.props.closeDemoModal}>x</div>
                <div className="game-demo-viewport" style={ { width: viewportWidth, height: viewportHeight  } }>
                    <DemoIFrame game={game} channel={channel} />
                </div>
                <div className="game-demo-modal-detail" style={ { width: detailWidth } }>
                    <div className="game-demo-modal-title">{game.name}</div>
                    <p className="game-demo-modal-description">Lorem ipsum dolor sit amet consectituer adipiscing elit nam. {game.description}</p>
                    <dl>
                        <dt>Channel</dt><dd><ChannelList channels={game.channels} glue=" | " /></dd>
                        <dt>Lines</dt><dd>##</dd>
                        <dt>RTP</dt><dd>##%</dd>
                        <dt>Volatility</dt><dd>???????</dd>
                    </dl>
                    <LinkButton className="btn-blue" to={`/game/${game.id}/${game.slug}`}>View game info</LinkButton>

                    <DemoSwitch game={game} channel={channel} setChannel={this.setChannel} />
                </div>
            </div>
        )
    }
}

export default DemoModal;
