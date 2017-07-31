import axios from 'axios';

var instance = axios.create({
    baseURL: process.env.REACT_APP_GAMES_API_BASEURL
});

var Category =  {
    all: function (config) {
        return instance.get('/category', config);
    },
    getById: function(id){
        return instance.get('/category/' + id);
    }
};

export default Category;