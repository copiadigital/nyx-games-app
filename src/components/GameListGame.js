import React, { Component } from 'react';
import Button from './utilities/Button';
import ImageLoader from './utilities/ImageLoader';
import LoadingImage from './utilities/LoadingImage';

class GameListGame extends Component {
    constructor(props) {
        super(props);

        this.state = {
            highlight: false
        };

        this.mouseEnter = this.mouseEnter.bind(this);
        this.mouseLeave = this.mouseLeave.bind(this);
    }
    mouseEnter() {
        this.setState({ highlight: true });
    }
    mouseLeave() {
        this.setState({ highlight: false });
    }
    renderHighlight(game) {
        return (
            <div>
                <div className="games-grid-game-name">{game.name}</div>
                <Button className="btn-white" to={`/game/${game.id}/${game.slug}`}>Play</Button>
                <Button className="btn-white" to={`/game/${game.id}/${game.slug}`}>Info</Button>
            </div>
        );
    }
    renderNormal(game) {
        return (
            <div>
                <ImageLoader
                    src={"https://dga1sy052ek6h.cloudfront.net/icons/200x127/" + game.id + ".jpg"}
                    loading={<LoadingImage width="35" height="35" />}
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
