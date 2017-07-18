import React, { Component } from 'react';
import games from './../data/games';

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
                console.log('games!', res.data.games);

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

        if(this.state.games.length === 0){
            return (<div><p className="none-found none-found__games">No games found.</p></div>)
        }

        return (
            <div>
                <p>Games here!</p>
            </div>
        );
    }
}

export default GameList;
