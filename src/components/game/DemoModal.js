import React, { Component } from 'react';
import ReactGA from 'react-ga';
import ChannelList from "../utilities/ChannelList";
import Downloads from "../utilities/Downloads";
import Download from "../utilities/Download";
import ImageLoader from "../utilities/ImageLoader";
import ShareUrlTool from "../utilities/ShareUrlTool";
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
    componentDidMount(){
        ReactGA.event({
            category: 'Game',
            action: 'View demo modal',
            label: 'ID:' + this.state.game.id
        });
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
    renderDemo() {
        const game = this.state.game;
        const channel = this.state.channel;

        if(game.hasDemo()) {
            return <DemoIFrame game={game} channel={channel}/>;
        }else{
            return <ImageLoader
                src={"https://dga1sy052ek6h.cloudfront.net/icons/livegames/" + game.id + ".png"}
                loading={<div />}
                containerClassName="game-demo-icon-placeholder"
                className="game-demo-icon-placeholder-image"
                error={<span>Demo unavailable, please contact your account manager for more information.</span>}
            />;
        }
    }
    render() {
        const game = this.state.game;
        const channel = this.state.channel;

        var forceContent = function(val){
          return (!_.isNumber(val) && _.isEmpty(val))? 'n/a' : val;
        };

        return (
            <div className="game-demo-modal-container">
                <ShareUrlTool className="game-demo-modal-icon game-demo-modal-share" url={window.location.toString()} />
                <div className="game-demo-modal-icon game-demo-modal-close" onClick={this.props.closeDemoModal} title="Close">
                    <span role="img" aria-label="Close">&#10060;</span>
                </div>

                <div className="game-demo-viewport">
                    <div className="game-demo-viewport-frame">
                        <div className="game-demo-viewport-frame-holder">
                            {this.renderDemo()}
                        </div>
                    </div>
                </div>

                <div className="game-demo-modal-detail">
                    <div className="game-demo-modal-title">{game.name}</div>

                    <ImageLoader
                        src={"https://dga1sy052ek6h.cloudfront.net/icons/gplogos/" + game.studio.name + ".png"}
                        loading={<div />}
                        containerClassName="game-demo-modal-provider"
                        className="game-provider-icon"
                        error={<span>by {game.studio.name}</span>}
                    />

                    <dl>
                        <dt>Channel</dt><dd><ChannelList channels={game.channels} glue=" | " /></dd>
                        <dt>RTP</dt><dd>{forceContent(game.rtp)}</dd>
                        <dt>Volatility</dt><dd>{forceContent(game.volatility)}</dd>
                        <dt>Game ID</dt><dd>{forceContent(game.id)}</dd>
                        <dt>Studio</dt><dd>{forceContent(game.studio.name)}</dd>
                        <dt>Branded</dt><dd>{forceContent(game.brand_licensed)}</dd>
                        <dt>Jackpot</dt><dd>{forceContent(game.jackpot_enabled)}</dd>
                        <dt>Free Spins</dt><dd>{forceContent(game.freerounds_enabled)}</dd>
                    </dl>

                    {/*
                    <Downloads title="Downloads" className="downloads">
                        <Download href={`https://dga1sy052ek6h.cloudfront.net/ogsmarketing/${game.id}.zip`} title="Marketing pack" />
                        <Download href={`https://dga1sy052ek6h.cloudfront.net/ogscertificates/${game.id}.zip`} title="Certificate pack" />
                    </Downloads>
                    */}

                    <p className="game-demo-modal-description">{game.description}</p>

                    {/*<LinkButton className="btn-blue" to={`/game/${game.id}/${game.slug}`}>View game info</LinkButton>*/}

                    <div className="game-demo-switch-container">
                        <DemoSwitch game={game} channel={channel} setChannel={this.setChannel} />
                        <span>Demo options</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default DemoModal;
