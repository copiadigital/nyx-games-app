import React, { Component } from 'react';
import axios from 'axios';

class Downloads extends Component {
    constructor(props){
        super(props);

        this.state = {
            items: this.props.children
        };
    }
    componentDidMount(){
        this.checkItemsAreValid();
    }
    checkItemsAreValid(){
        var self = this;
        var items = this.state.items;

        React.Children.forEach(items, function(child, i){
            var url = child.props.href;
            
            axios({
                url: url,
                method: 'head',
                timeout: 2000
            }).then(function(response){
                // leave file in list
            }).catch(function(error){
                console.warn('Error checking file', url, error);
                self.removeItemByHref(url);
            });
        });
    }
    removeItemByHref(href){
        var items = this.state.items;
        var filteredItems = items.filter(function(item){
            return (item.props.href !== href);
        });

        this.setState({ items: filteredItems });
    }
    render() {
        const items = this.state.items;
        const className = this.props.className? this.props.className : 'downloads';

        if(items.length < 1){
            return null;
        }

        return (
            <div>
                <h3>Downloads</h3>
                <ul className={className}>
                    {items}
                </ul>
            </div>
        );
    }
}

export default Downloads;