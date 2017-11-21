import queryString from 'query-string';
import update from 'immutability-helper';
import _ from 'underscore';

var queryStringOptions = {
    arrayFormat: 'bracket'
};

class FilterManager {
    constructor(router, config){
        this.router = router;
        this.config = _.defaults(config, {
            basePath: '/'
        });
        this.filterUpdateCallbacks = [];
        this.state = {
            filter: {},
            demoModal: null
        };
    }
    clearFilter(){
        var filter = {};
        this.state.filter = filter;
        this.updateUrl(filter, this.state.demoModal);
        this.triggerFilterUpdate(filter);
    }
    setFilter(data) {
        // set explicitFeatured if we've just changed to featured or its already set
        // needed to switch to a list of all games on filter change, unless user has actually asked for featured games
        if('featured' in data) {
            data.explicitFeatured = (data.featured);
        }

        var filter = update(this.state.filter, { $merge: data });

        // determine featured
        var hasFilters = this.hasFilters(filter);
        filter.featured = (data.featured !== false && (filter.explicitFeatured || !hasFilters));

        this.state.filter = filter;

        this.updateUrl(filter, this.state.demoModal);
        this.triggerFilterUpdate(filter);
    }
    assume(params){
        var filter = this.buildFilter(params);
        this.state.filter = filter;
        this.triggerFilterUpdate(filter);
    }
    registerFilterUpdateCallback(callback){
        this.filterUpdateCallbacks.push(callback);
    }
    triggerFilterUpdate(filter){
        _.each(this.filterUpdateCallbacks, function(callback){
           callback(filter);
        });

    }
    buildFilter(params){
        _.defaults(params, {
           featured: false,
            explicitFeatured: false,
            queryString: ''
        });

        var filter = {
            featured: (params.featured),
            explicitFeatured: (params.explicitFeatured)
        };

        var queryParams = queryString.parse(params.queryString, queryStringOptions);
        if('featured' in queryParams){
            filter['featured'] = (queryParams.featured && queryParams.featured !== 'false');
        }

        filter['searchQuery'] = queryParams.query;
        filter['category'] = queryParams.category;
        filter['channel'] = queryParams.channel;
        filter['jurisdiction'] = queryParams.jurisdiction;
        filter['studio'] = queryParams.studio;
        filter['sort'] = queryParams.sort;
        filter['order'] = queryParams.order;

        return filter;
    }
    hasFilters(filter){
        return (_.size(_.reject(_.omit(filter, ['featured', 'explicitFeatured']), _.isEmpty)) > 0);
    }
    buildUrl(filter, basePath) {
        var queryStringData;

        if(typeof basePath === 'undefined'){
            basePath = this.config.basePath;
        }

        if(filter.searchQuery){
            queryStringData = {
                query: filter.searchQuery
            };
        }else {
            queryStringData = {
                featured: (filter.featured)? 1 : 0,
                category: filter.category,
                channel: filter.channel,
                jurisdiction: filter.jurisdiction,
                studio: filter.studio,
                sort: filter.sort,
                order: filter.order
            };
        }

        var path = this.resolveBasePath(basePath, filter, queryStringData);

        // remove null/undefined filters
        queryStringData = _.pick(queryStringData, function(val){
            return (_.isNull(val) === false && _.isUndefined(val) === false);
        });

        var query = queryString.stringify(queryStringData, queryStringOptions);
        return path + '?' + query;
    }
    updateUrl(filter){
        var newUrl = this.buildUrl(filter);
        this.router.history.push(newUrl);
    }
    resolveBasePath(basePath, filter, queryParams){
        if(typeof(basePath) === 'function'){
            return basePath(filter, queryParams);
        }

        return basePath;
    }
}

export default FilterManager;