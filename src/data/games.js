import axios from 'axios';

var instance = axios.create({
    baseURL: process.env.REACT_APP_GAMES_API_BASEURL
});

var Games =  {
    all: function (config) {
        return instance.get('/game', config);
    },
    getById: function(id){
        return instance.get('/game/' + id);
    }
};

export default Games;