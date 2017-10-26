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
        // var CancelToken = axios.CancelToken;

        React.Children.forEach(items, function(child, i){
            axios({
                url: child.props.href,
                method: 'head',
                timeout: 2000,
                responseType:'stream',
                // cancelToken: new CancelToken(function executor(c) {
                //     // Cancel the request if it is taking more than 500ms
                //     setTimeout(c, 500);
                // })
            }).then(function(response){
                response.data.abort();
            }).catch(function(error){
                if (axios.isCancel(error)) {
                    console.log('Request canceled', error.message);
                } else {
                    self.removeItemByHref(child.props.href);
                }
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