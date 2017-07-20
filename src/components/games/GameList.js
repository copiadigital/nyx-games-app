import React, { Component } from 'react';
import games from '../../data/games';
import GameListGame from './GameListGame';
import Loading from "../utilities/Loading";
import './GameList.css';

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

        games.all({
            params: {
                itemsPerPage: 12,
                featured: (this.props.featured)? 1 : 0
            }
        })
        .then((res) => {
            this.setState({
                loading: false,
                games: res.data.games
            });
        });
    }
    render() {
        if(this.state.loading){
            return <Loading/>;
        }

        const games = this.state.games;

        if(games.length === 0){
            return (<div><p className="none-found none-found__games">No games found.</p></div>)
        }

        const gameNode = games.map((game) => {
            return (<GameListGame game={game} key={game.id} />)
        });

        return (
            <div className="games-grid-container">
                <ul className="games-grid">
                    {gameNode}
                </ul>
            </div>
        );
    }
}

export default GameList;
