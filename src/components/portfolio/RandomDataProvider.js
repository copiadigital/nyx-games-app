import Promise from 'promise';

class RandomDataProvider{
    constructor(total){
        this.total = total;
        this.data = this.generateItems(total);
    }

    generateItems(total){
        var items = [];
        var sample = sampler(['Blue', 'Black', 'Red', 'Orange', 'Yellow', 'Green', 'White']);

        for(var i = 0; i < total; i++){
            items.push({
                id: i,
                name: sample()
            });
        }

        return items;
    }

    getItems(start, end){
        var self = this;

        return new Promise(function(fulfill, reject){
            var items = self.data.slice(start, end);

            fulfill({
                items: items,
                total: self.total
            });
        });
    }
}

function sampler(set){
    var index = 0;

    return function(){
        var data = set[index];
        index++;

        if(index >= set.length){
            index = 0;
        }

        return data;
    }
}

export default RandomDataProvider;