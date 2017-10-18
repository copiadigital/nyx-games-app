import axios from 'axios';
import _ from 'underscore';

class AbstractModel {
    constructor(){
        this.instance = axios.create({
            baseURL: process.env.REACT_APP_GAMES_API_BASEURL
        });
    }
    fetchAll(url, config){
        var self = this;
        return this.instance.get('/game', config).then(function(result){
            // merge entity class
            if(self.entityObject){
                _.each(result.data[self.listKey], function(game){
                   Object.assign(game, self.entityObject);
                });
            }

            return result.data;
        });
    }
    fetch(url){
        var self = this;

        return this.instance.get(url).then(function(result){
            // merge entity class
            if(self.entityObject){
                Object.assign(result.data[self.fetchKey], self.entityObject);
            }

            return result.data;
        });
    }
}

export default AbstractModel;