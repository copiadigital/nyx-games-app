import queryString from 'query-string';
import update from 'immutability-helper';
import _ from 'underscore';

var queryStringOptions = {
    arrayFormat: 'bracket'
};

class FilterManager {
    constructor(router){
        this.router = router;
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
        data.explicitFeatured = (this.state.filter.explicitFeatured || data.featured);

        var filter = update(this.state.filter, { $merge: data });

        // determine featured
        var hasFilters = (_.size(_.reject(_.omit(filter, ['featured', 'explicitFeatured']), _.isEmpty)) > 0);
        filter.featured = (filter.explicitFeatured || !hasFilters);

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
        filter['searchQuery'] = queryParams.query;
        filter['category'] = queryParams.category;
        filter['channel'] = queryParams.channel;
        filter['jurisdiction'] = queryParams.jurisdiction;
        filter['studio'] = queryParams.studio;
        filter['sort'] = queryParams.sort;
        filter['order'] = queryParams.order;

        return filter;
    }
    buildUrl(filter, demoModal) {
        var path, queryStringData;

        if(filter.searchQuery){
            path = '/games/all';
            queryStringData = {
                query: filter.searchQuery
            };
        }else {
            var hasFilters = (_.size(_.reject(_.omit(filter, ['featured', 'explicitFeatured']), _.isEmpty)) > 0);
            path = '/games/' + ((filter.featured && filter.explicitFeatured) ? 'featured' : ((filter.featured && !hasFilters)? '' : 'all'));
            queryStringData = {
                category: filter.category,
                channel: filter.channel,
                jurisdiction: filter.jurisdiction,
                studio: filter.studio,
                sort: filter.sort,
                order: filter.order
            };
        }

        // remove null/undefined filters
        queryStringData = _.pick(queryStringData, function(val){
            return (_.isNull(val) === false && _.isUndefined(val) === false);
        });

        var query = queryString.stringify(queryStringData, queryStringOptions);
        var hash = (demoModal)? 'game' + demoModal.game.id + '-' + demoModal.channel : null;
        return path + '?' + query + (hash? '#' + hash : '');
    }
    updateUrl(filter, demoModal){
        var newUrl = this.buildUrl(filter, demoModal);
        this.router.history.push(newUrl);
    }
}

export default FilterManager;