import React, { Component } from 'react';
import ChannelList from "../utilities/ChannelList";
import ImageLoader from "../utilities/ImageLoader";
import DemoIFrame from "./DemoIFrame";
import DemoSwitch from "./DemoSwitch";
import _ from 'underscore';

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

        var forceContent = function(val){
          return (!_.isNumber(val) && _.isEmpty(val))? 'n/a' : val;
        };

        return (
            <div className="game-demo-modal-container">
                <div className="game-demo-modal-close" onClick={this.props.closeDemoModal}>x</div>
                <div className="game-demo-viewport" style={ { width: viewportWidth, height: viewportHeight  } }>
                    <DemoIFrame game={game} channel={channel} />
                </div>
                <div className="game-demo-modal-detail" style={ { width: detailWidth } }>
                    <div className="game-demo-modal-title">{game.name}</div>
                    <p className="game-demo-modal-description">Lorem ipsum dolor sit amet consectituer adipiscing elit nam. {game.description}</p>

                    <ImageLoader
                        src={"https://dga1sy052ek6h.cloudfront.net/icons/gplogos/" + game.studio.name + ".png"}
                        loading={<div />}
                        className="game-provider-icon"
                        error={<span>{game.studio.name} logo</span>}
                    />

                    <dl>
                        <dt>Channel</dt><dd><ChannelList channels={game.channels} glue=" | " /></dd>
                        <dt>RTP</dt><dd>{forceContent(game.rtp)}</dd>
                        <dt>Volatility</dt><dd>{forceContent(game.volatility)}</dd>
                        <dt>Game ID</dt><dd>OGS {forceContent(game.id)}</dd>
                        <dt>Studio</dt><dd>{forceContent(game.studio.name)}</dd>
                        <dt>Branded</dt><dd>{forceContent(game.brand_licensed)}</dd>
                        <dt>Jackpot</dt><dd>{forceContent(game.jackpot_enabled)}</dd>
                        <dt>Free Spins</dt><dd>{forceContent(game.freerounds_enabled)}</dd>
                    </dl>

                    <h3>Downloads</h3>
                    <a href="#example">Example file</a>

                    {/*<LinkButton className="btn-blue" to={`/game/${game.id}/${game.slug}`}>View game info</LinkButton>*/}

                    <DemoSwitch game={game} channel={channel} setChannel={this.setChannel} />
                </div>
            </div>
        )
    }
}

export default DemoModal;
