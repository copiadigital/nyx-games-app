import React, { Component } from 'react';
import ReactGA from 'react-ga';
import ChannelList from "../utilities/ChannelList";
import DemoSwitch from "./DemoSwitch";
import ImageLoader from "../utilities/ImageLoader";
import Responsive from 'react-responsive';
import _ from 'underscore';

const Desktop = props => <Responsive {...props} minWidth={992} />;

class DetailBar extends Component {

    constructor(props){
        super(props);
        this.state = {
        };

        this.makeFullScreen = this.props.setFullScreen.bind(this);
        this.setFullScreen = this.setFullScreen.bind(this);
    }

    setFullScreen() {
        this.makeFullScreen();
    }

    render() {
        const game = this.props.game;
        const channel = this.props.channel;

        var forceContent = function(val){
            return (!_.isNumber(val) && _.isEmpty(val))? 'n/a' : val;
        };

        return (
            <div className="game-demo-modal-detail">
                <div className="game-demo-modal-title">{game.name}</div>

                <ImageLoader
                    src={"https://d3htn38ft20trn.cloudfront.net/icons/gplogos/" + game.studio.name + ".png"}
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
                    <Download href={`https://d3htn38ft20trn.cloudfront.net/ogsmarketing/${game.id}.zip`} title="Marketing pack" />
                    <Download href={`https://d3htn38ft20trn.cloudfront.net/ogscertificates/${game.id}.zip`} title="Certificate pack" />
                </Downloads>
                */}

                <p className="game-demo-modal-description">{game.description}</p>

                {/*<LinkButton className="btn-blue" to={`/game/${game.id}/${game.slug}`}>View game info</LinkButton>*/}

                <div className="game-demo-switch-container">
                    <DemoSwitch game={game} channel={channel} setChannel={this.setChannel} />
                    <span>Demo options</span>
                </div>
                <Desktop>
                    <div className="game-demo-fullscreen-container">
                        <button className="button-class" onClick={this.setFullScreen}>Full Screen</button>
                    </div>
                </Desktop>
            </div>
        )
    }
}

export default DetailBar;
