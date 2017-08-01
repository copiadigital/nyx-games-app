import React, { Component } from 'react';
import games from '../../data/games';
import Loading from "../utilities/Loading";
import ImageLoader from "../utilities/ImageLoader";
import ChannelList from "../utilities/ChannelList";

class Game extends Component {
    constructor(props){
        super(props);

        this.state = {
            loading: true,
            game: null
        };
    }
    componentDidMount(){
        this.loadGame();
    }
    loadGame(){
        // get the game to load from the route params
        const gameId = this.props.match.params.gameId;

        // mark component as loading
        this.setState({ loading: true });

        // grab the game data
        games.getById(gameId)
            .then((res) => {
                this.setState({
                    loading: false,
                    game: res.data.game
                });
            });
    }
    render() {
        if(this.state.loading){
            return <Loading/>
        }

        const game = this.state.game;

        return (
            <div>
                <h1>{game.name}</h1>
                <ImageLoader
                    src={"/static/images/icons/providers/" + game.provider + ".png"}
                    loading={<div />}
                    className="game-provider-icon"
                    error={<span>{game.provider} logo</span>}
                />
                <p className="games-grid-game-summary">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

                <div className="col-6">
                    <h2>Key Data</h2>
                    <dl>
                        <dt>Channel</dt><dd><ChannelList channels={game.channels} glue=" | " /></dd>
                        <dt>Lines</dt><dd>##</dd>
                        <dt>RTP</dt><dd>##%</dd>
                        <dt>Volatility</dt><dd>???????</dd>
                        <dt>Max Win</dt><dd>???????</dd>
                        <dt>Top Award</dt><dd>### Coins</dd>
                    </dl>
                    <dl>
                        <dt>GameID</dt><dd>OGS: {game.id}</dd>
                        <dt>Studio</dt><dd>{game.provider}</dd>
                    </dl>
                </div>
                <div className="col-6">
                    <h2>Downloads</h2>
                    <p>n/a</p>
                </div>

                <h2>Similar Games</h2>

            </div>
        );
    }
}

export default Game;
