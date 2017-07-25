import axios from 'axios';

var instance = axios.create({
    baseURL: process.env.REACT_APP_GAMES_API_BASEURL
});

var Jurisdiction =  {
    all: function (config) {
        return instance.get('/jurisdiction', config);
    },
    getById: function(id){
        return instance.get('/jurisdiction/' + id);
    }
};

export default Jurisdiction;