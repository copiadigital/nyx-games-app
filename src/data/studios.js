import axios from 'axios';

var instance = axios.create({
    baseURL: process.env.REACT_APP_GAMES_API_BASEURL
});

var Studio =  {
    all: function (config) {
        return instance.get('/studio', config);
    },
    getById: function(id){
        return instance.get('/studio/' + id);
    }
};

export default Studio;