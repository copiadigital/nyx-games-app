import Promise from 'promise';
import _ from 'underscore';
import {EventEmitter} from 'fbemitter';

class PaginatedDataProvider extends EventEmitter{
    constructor(settings){
        super();

        if(!settings){
            settings = {};
        };

        _.defaults(settings, {
            itemsPerPage: 25,
            getPage: function(page, itemsPerPage){
                throw new Error('getPage method not supplied');
            },
        });

        this.settings = settings;
        this.pendingRequests = [];
        this.data = [];
        this.total = null;
        this.events = [];
    }

    reset(){
        this.data = [];
        this.total = null;
    }

    getItems(start, end){
        var self = this;

        return this.ensureItems(start, end).then(function(){
            var output = {
                items: self.data.slice(start, end),
                total: self.total
            };

            return output;
        }).then(function(result){
            self.emit('updateItems', result);
            return result;
        });
    }

    ensureItems(start, end){
        var self = this;
        var rangesRequired = self.getRangesRequired(start, end);
        var promises = [];

        _.each(rangesRequired, function(range){
            var promise = self.getItemsFromServer(range[0], range[1]);
            promises.push(promise);
        });

        return Promise.all(promises);
    }

    getRangesRequired(start, end){
        var itemsPerPage = this.settings.itemsPerPage;

        var blockStart = Math.floor(start/itemsPerPage)*itemsPerPage;
        var blockEnd = Math.ceil(end/itemsPerPage)*itemsPerPage;

        var rangesRequired = [];
        for(var i = blockStart; i < blockEnd; i+=itemsPerPage){
            var rangeStart = i;
            var rangeEnd = i + itemsPerPage - 1;

            if(!this.hasRange(rangeStart, rangeEnd)){
                rangesRequired.push([rangeStart, rangeEnd]);
            }
        }

        return rangesRequired;
    }

    hasRange(start, end){
        var dataLength = this.data.length;
        // once we know the total items, make sure we don't ask for more than the total!
        // the first time this is called we don't know the total so just go with request size
        var realEnd = Math.min(end, (this.total === null)? Infinity : this.total - 1);

        if(dataLength === 0){
            return false;
        }

        if(dataLength - 1 < realEnd){
            return false;
        }

        return (this.data[start] !== null && this.data[realEnd] !== null);
    }

    getItemsFromServer(start, end){
        var self = this;

        var itemsPerPage = this.settings.itemsPerPage;
        var page = Math.floor(start / itemsPerPage) + 1;
        var requestStart = start;

        if(requestStart in this.pendingRequests){
            return this.pendingRequests[requestStart];
        }

        var requestPromise = this.settings.getPage(page, itemsPerPage).then((result) => {
            if ('items' in result === false) {
                throw new Error('Reponse must include items key');
            }

            if ('total' in result === false) {
                throw new Error('Reponse must include total key');
            }

            self.storeItems(requestStart, result.items);
            self.total = result.total;

            delete self.pendingRequests[requestStart];
        }).catch(function(){
            delete self.pendingRequests[requestStart];
        });

        this.pendingRequests[requestStart] = requestPromise;
        return requestPromise;
    }

    storeItems(index, items){
        if(items.length === 0){
            return;
        }

        if(this.data.length < index){
            var filler = new Array(index - this.data.length).fill(null);
            this.data.splice(this.data.length, 0, ...filler);
        }

        this.data.splice(index, items.length, ...items);
    }
}

export default PaginatedDataProvider;