import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import _ from 'underscore';
import ImageLoader from '../utilities/ImageLoader';
import LoadingImage from '../utilities/LoadingImage';

class GameListGame extends Component {
    constructor(props) {
        super(props);

        this.state = {
            highlight: false
        };

        this.mouseEnter = this.mouseEnter.bind(this);
        this.mouseLeave = this.mouseLeave.bind(this);
        this.playDemoButtonHandler = this.playDemoButtonHandler.bind(this);
    }
    mouseEnter() {
        this.setState({ highlight: true });
    }
    mouseLeave() {
        this.setState({ highlight: false });
    }
    playDemoButtonHandler(channel){
        var self = this;

        if(_.isEmpty(channel)){
            channel = null;
        }

        return function(e){
            e.preventDefault();
            self.playDemo(channel);
        }
    }
    playDemo(channel){
        if(_.isEmpty(channel)){
            var game = this.props.game;
            channel = (game.channels.indexOf('desktop') > -1) ? 'desktop' : 'mobile';
        }

        this.props.openDemoModal(channel);
    }
    renderHighlight(game) {
        return (
            <div>
                <div className="games-grid-game-name">{game.name}</div>
                <div className="games-grid-game-info">
                    <a className="btn-white" href="#info" onClick={this.playDemoButtonHandler()}>i</a>
                </div>
                <div className="games-grid-game-description">
                    <p>Lorem ipsum dolor...</p>
                </div>
                <div className="games-grid-game-demo-options">
                    <span className="games-grid-game-demo-title">Play Demo</span>
                    { ( (game.channels.indexOf('desktop') > -1) ? <button className="btn btn-white games-grid-game-demo games-grid-game-demo_desktop" onClick={this.playDemoButtonHandler('desktop')}>Desktop</button> : '' ) }
                    { ( (game.channels.length > 1) ? <span className="or">or</span> : '' ) }
                    { ( (game.channels.indexOf('mobile') > -1) ? <button className="btn btn-white games-grid-game-demo games-grid-game-demo_mobile" onClick={this.playDemoButtonHandler('mobile')}>Mobile</button> : '' ) }
                </div>

            </div>
        );
    }
    renderNormal(game) {
        return (
            <div>
                <ImageLoader
                    src={"https://dga1sy052ek6h.cloudfront.net/icons/200x127/" + game.id + ".jpg"}
                    loading={<LoadingImage width="35" height="35" />}
                    className="games-grid-game-icon"
                    error={<span>{game.name}</span>}
                />
            </div>
        );
    }
    render() {
        const game = this.props.game;

        return (
            <li className="games-grid-game-container" onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}>
                <div className={"games-grid-game" + (this.state.highlight ? " games-grid-game__highlight" : "")}>
                    {this.state.highlight ? this.renderHighlight(game) : this.renderNormal(game) }
                </div>
            </li>
        );
    }
}

export default GameListGame;
