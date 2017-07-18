import React, { Component } from 'react';
import games from './../data/games';
import GameListGame from './GameListGame';

class GameList extends Component {
    constructor(props){
        super(props);

        this.state = {
            loading: true,
            games: []
        };
    }
    componentDidMount(){
        this.loadGames();
    }
    loadGames(){
        this.setState({ loading: true });

        games.all()
            .then((res) => {
                this.setState({
                    loading: false,
                    games: res.data.games
                });
            });
    }
    render() {
        if(this.state.loading){
            return (<div><p className="loading loading__games">Loading...</p></div>);
        }

        const games = this.state.games;

        if(games.length === 0){
            return (<div><p className="none-found none-found__games">No games found.</p></div>)
        }

        const gameNode = games.map((game) => {
            return (<GameListGame game={game} key={game.id} />)
        });

        return (
            <div>
                <ul>{gameNode}</ul>
            </div>
        );
    }
}

export default GameList;
