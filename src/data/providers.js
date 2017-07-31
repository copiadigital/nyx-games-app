import axios from 'axios';

var instance = axios.create({
    baseURL: process.env.REACT_APP_GAMES_API_BASEURL
});

var Provider =  {
    all: function (config) {
        return instance.get('/provider', config);
    },
    getById: function(id){
        return instance.get('/provider/' + id);
    }
};

export default Provider;