import React, { Component } from 'react';
import games from './../data/games';
import Loading from "./Loading";

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
            </div>
        );
    }
}

export default Game;
