import React, { Component } from 'react';
import ReactGA from 'react-ga';
import Modal from 'react-modal';
import Waypoint from 'react-waypoint';
import _ from 'underscore';
import Games from './../../data/model/Games';
import GameListGame from './GameListGame';
import Loading from "../utilities/Loading";
import DemoModal from "../game/DemoModal";

class GameList extends Component {
    constructor(props){
        super(props);

        this.state = {
            loading: true,
            more: false,
            currentPage: 1,
            games: [],
            highlightedGame: (props.highlightedGame)? props.highlightedGame : null,
            isDemoModalOpen: (props.demoModal)? true : false,
            demoModal: (props.demoModal)? props.demoModal : null
        };

        this.gamesModel = new Games();

        this.loadMoreGames = this.loadMoreGames.bind(this);
        this.highlightGame = this.highlightGame.bind(this);
        this.openDemoModal = this.openDemoModal.bind(this);
        this.closeDemoModal = this.closeDemoModal.bind(this);
    }
    componentDidMount(){
        this.loadGames(this.props);
    }
    componentWillReceiveProps(nextProps){
        var self = this;
        var newState = {};
        var requireGamesLoad = false;

        if(!_.isEqual(this.props.filter, nextProps.filter)){
            requireGamesLoad = true;
            newState.loading = true;
            newState.more = false;
            newState.currentPage = 1;
        }

        if(!_.isEqual(this.props.demoModal, nextProps.demoModal)){
            newState.isDemoModalOpen = (nextProps.demoModal)? true : false;
            newState.demoModal = nextProps.demoModal;
        }

        var stateCallback = function(){
            if(requireGamesLoad) {
                self.loadGames(nextProps);
            }
        };

        this.setState(newState, stateCallback);
    }
    loadGames(props){
        this.setState({ loading: true });

        var defaultSort = (props.filter.searchQuery)? '_score' : 'released';
        var defaultOrder = (props.filter.searchQuery)? 'desc' : 'desc';

        this.gamesModel.all({
            params: {
                page: this.state.currentPage,
                itemsPerPage: 25,
                q: props.filter.searchQuery,
                featured: (props.filter.featured)? 1 : 0,
                category: props.filter.category,
                jurisdiction: props.filter.jurisdiction,
                studio: props.filter.studio,
                channel: props.filter.channel,
                sort: props.filter.sort ? props.filter.sort : defaultSort,
                order: props.filter.order ? props.filter.order : defaultOrder
            }
        })
        .then((data) => {
            var currentPage = data.meta.currentPage;
            var totalPages = data.meta.totalPages;

            this.setState((prevState) => ({
                loading: false,
                more: (currentPage < totalPages),
                currentPage: currentPage,
                games: (currentPage > 1)? [ ...prevState.games, ...data.games ] : data.games
            }));
        });
    }
    loadMoreGames(){
        // increment currentPage and call load games
        this.setState((state) => ({currentPage : state.currentPage + 1}), () => ( this.loadGames(this.props) ));

        ReactGA.event({
            category: 'GameList',
            action: 'Load more',
            label: 'Page ' + this.state.currentPage + 1
        });
    }
    highlightGame(game){
        this.setState((prevState) => {
            return ((prevState.highlightedGame === null && game !== null) || (game === null && prevState.highlightedGame !== null) || (prevState.highlightedGame.id !== game.id))? {highlightedGame: game} : null;
        });
    }
    openDemoModal(game, channel){
        this.props.openDemoModal(game, channel);
    }
    closeDemoModal() {
        this.props.closeDemoModal();
    }
    render() {
        const loading = this.state.loading;
        const more = this.state.more;
        const games = this.state.games;
        const highlightedGameId = this.state.highlightedGame? this.state.highlightedGame.id : null;

        if(loading && games.length === 0){
            return <Loading />;
        }else if(games.length === 0){
            return (<div><p className="none-found none-found__games">No games found.</p></div>)
        }

        const gameNode = games.map((game) => {
            return (<GameListGame
                game={game}
                key={game.id}
                highlight={(game.id === highlightedGameId)}
                highlightGame={this.highlightGame}
                openDemoModal={(channel) => (this.openDemoModal(game, channel))}
            />)
        });

        return (
            <div className="games-grid-container">
                <ul className="games-grid">
                    {gameNode}
                </ul>
                {(more && !loading? this.renderLoadMoreButton() : '')}
                {(loading? <div><Loading /></div> : '')}
                <Modal
                    isOpen={this.state.isDemoModalOpen}
                    onRequestClose={this.closeDemoModal}
                    contentLabel="Game demo modal"
                    className="modal game-demo-modal"
                    overlayClassName="modal-overlay"
                >
                    {(this.state.isDemoModalOpen? <DemoModal
                        game={this.state.demoModal.game}
                        channel={this.state.demoModal.channel}
                        closeDemoModal={this.closeDemoModal}
                        openDemoModal={this.openDemoModal}
                    /> : null)}
                </Modal>
            </div>
        );
    }
    renderLoadMoreButton() {
        return <div>
            <Waypoint onEnter={this.loadMoreGames} >
                <button onClick={this.loadMoreGames}>Load More Games</button>
            </Waypoint>
        </div>
    }
}

export default GameList;
