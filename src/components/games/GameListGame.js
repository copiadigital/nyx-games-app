import React, { Component } from 'react';
import _ from 'underscore';
import ImageLoader from '../utilities/ImageLoader';
import LoadingImage from '../utilities/LoadingImage';
import StringTrim from '../utilities/StringTrim';
import Responsive from 'react-responsive';

const Desktop = props => <Responsive {...props} minWidth={992} />;
const Tablet = props => <Responsive {...props} minWidth={768} maxWidth={991} />;
const Mobile = props => <Responsive {...props} maxWidth={767} />;

class GameListGame extends Component {
    constructor(props) {
        super(props);

        this.state = {
            highlight: props.highlight
        };

        this.mouseEnter = this.mouseEnter.bind(this);
        this.mouseLeave = this.mouseLeave.bind(this);
        this.playDemoButtonHandler = this.playDemoButtonHandler.bind(this);
    }
    componentWillReceiveProps(nextProps){
        this.setState({ highlight: nextProps.highlight });
    }
    shouldComponentUpdate(nextProps, nextState){
        // speeds up hover state changes immensely, by only firing update for highlight state
        return (this.state.highlight !== nextState.highlight);
    }
    mouseEnter() {
        if(!this.state.highlight){
            this.props.highlightGame(this.props.game);
        }
    }
    mouseLeave() {
        if(this.state.highlight){
            this.props.highlightGame(null);
        }
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
                { /*
                <div className="games-grid-game-info">
                    <a className="btn-white" href="#info" onClick={this.playDemoButtonHandler()}>i</a>
                </div>
                */ }
                <div className="games-grid-game-description">
                    <p>{StringTrim(game.description, 70, '...')}</p>
                </div>
                <div className="games-grid-game-demo-options">
                    <span className="games-grid-game-demo-title">Play Demo</span>
                    { ( (game.channels.indexOf('desktop') > -1) ? <button className="games-grid-game-demo games-grid-game-demo_desktop" onClick={this.playDemoButtonHandler('desktop')}>Desktop</button> : '' ) }
                    { ( (game.channels.length > 1) ? <span className="or">or</span> : '' ) }
                    { ( (game.channels.indexOf('mobile') > -1) ? <button className="games-grid-game-demo games-grid-game-demo_mobile" onClick={this.playDemoButtonHandler('mobile')}>Mobile</button> : '' ) }
                </div>

            </div>
        );
    }
    renderNormal(game) {
        return (
            <div className="games-grid-game__icon">
                <ImageLoader
                    src={"https://d3htn38ft20trn.cloudfront.net/icons/200x127/" + game.id + ".png"}
                    loading={<LoadingImage width="35" height="35"/>}
                    className="games-grid-game-icon"
                    error={<span className="games-grid-game-icon-placeholder">{game.name}</span>}
                />
            </div>);
    }
    render() {
        const game = this.props.game;

        var classes = ['games-grid-game'];
        classes.push(this.state.highlight ? 'games-grid-game__highlight' : 'games-grid-game__default');

        if(game.high_quality){
            classes.push('games-grid-game--hq');
        }

        var now = new Date();
        var releasedDate = new Date(game.released);
        var newDate = new Date();
        newDate.setDate(now.getDate() - 30);

        var gameIsComingSoon = (releasedDate > now);
        var gameIsNew = (!gameIsComingSoon && releasedDate > newDate);

        if(gameIsComingSoon){
            classes.push('games-grid-game--coming');
        }

        if(gameIsNew){
            classes.push('games-grid-game--new');
        }
        

        let gameListItem = (
            <div className={ classes.join(' ') }>
                {game.high_quality ? <div className="games-grid-banner--hq" /> : '' }
                {gameIsComingSoon ? <div className="games-grid-banner--coming" /> : '' }
                {gameIsNew ? <div className="games-grid-banner--new" /> : '' }
                <Desktop>
                    {this.state.highlight ? this.renderHighlight(game) : this.renderNormal(game) }
                </Desktop>
                <Mobile>
                    {this.renderNormal(game)}
                </Mobile>
                <Tablet>
                    {this.renderNormal(game)}
                </Tablet>
            </div>
        );

        return (
            <span>
                <Desktop>
                <li className="games-grid-game-container" onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}>
                    {gameListItem}
                </li>
                </Desktop>
                <Mobile>
                <li className="games-grid-game-container" onClick={this.playDemoButtonHandler('mobile')}>
                    {gameListItem}
                </li>
                </Mobile>
                <Tablet>
                <li className="games-grid-game-container" onClick={this.playDemoButtonHandler('mobile')}>
                    {gameListItem}
                </li>
                </Tablet>
            </span>
        );
    }
}

export default GameListGame;
