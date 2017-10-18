import AbstractModel from './AbstractModel.js';
import Game from '../../entities/Game';

class Games extends AbstractModel {
    constructor(){
        super();

        this.entityObject = Game;
        this.listKey = 'games';
        this.fetchKey = 'game';
    }
    all(config) {
        return this.fetchAll('/game', config);
    }
    getById(id){
        return this.fetch('/game/' + id);
    }
};

export default Games;