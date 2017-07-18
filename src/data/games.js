import axios from 'axios';

var instance = axios.create({
    baseURL: process.env.REACT_APP_GAMES_API_BASEURL
});

var Games =  {
    all: function () {
        return instance.get('/game');
    }
};

export default Games;