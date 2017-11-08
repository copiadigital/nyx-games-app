import React, {Component} from 'react';
import RandomDataProvider from './RandomDataProvider';
import _ from 'underscore';


class Table extends Component {
    constructor(props) {
        super(props);

        this.rowHeight = this.props.rowHeight || 25;
        this.rowsToRender = this.props.rowsToRender || 25;
        this.rowBuffer = this.props.rowBuffer || 25;
        this.dataProvider = this.props.dataProvider || new RandomDataProvider(1000);
        this.scrollDebounce = this.props.scrollDebounce || 100;

        this.state = {
            offset: 0,
            totalItems: 0,
            data: []
        }

        this.onScroll = this.onScroll.bind(this);
    }

    componentWillMount(){
        var range = this.getCurrentRowRange();
        this.updateRowsForRange(range);
    }

    getCurrentRowRange(){
        return this.getRowRangeForOffset(this.state.offset);
    }

    getRowRangeForOffset(offset){
        var start = Math.floor(offset / this.rowHeight);
        var end = start + this.rowsToRender;

        var bufferStart = Math.max(0, start - this.rowBuffer);
        var bufferEnd = end + this.rowBuffer;

        return { start: start, end: end, bufferStart: bufferStart, bufferEnd: bufferEnd };
    }

    updateRowsForRange(range){
        var self = this;

        this.dataProvider.getItems(range.bufferStart, range.bufferEnd).then(function(result){
            self.setState({
                data: result.items,
                totalItems: result.total,
                waitForRowUpdate: false
            });
        }).catch(function(err){
            console.error('Error updating rows for range', err);

            self.setState({
                waitForRowUpdate: false
            });
        });
    }

    onScroll(e, number, view){
        var offset = e.target.scrollTop;
        this.getDelayedScrollOffsetTrigger()(offset);
    }

    getScrollOffsetTrigger(){
        var self = this;
        return function(offset) {
            self.setState({offset: offset, waitForRowUpdate: true}, function (newState) {
                var range = self.getCurrentRowRange();
                self.updateRowsForRange(range);
            });
        };
    }

    getDelayedScrollOffsetTrigger(){
        if(!this._delayedScrollOffsetTrigger){
            var trigger = this.getScrollOffsetTrigger();
            this._delayedScrollOffsetTrigger = (this.scrollDebounce > 0)? _.debounce(trigger, this.scrollDebounce) : trigger;
        }

        return this._delayedScrollOffsetTrigger;
    }

    shouldComponentUpdate(nextProps, nextState){
        if(nextState.waitForRowUpdate === true){
            return false;
        }

        return true;
    }

    render() {
        const range = this.getCurrentRowRange();
        const total = this.state.totalItems;
        const visibleHeight = this.rowHeight * this.rowsToRender;
        const topPadding = range.bufferStart * this.rowHeight;
        const bottomPadding = Math.max(0, (total - range.bufferEnd)) * this.rowHeight;

        let rows = this.state.data.map(item => {
            return (
                <TableRow
                    key={item.id}
                    data={item}
                    rowHeight={this.rowHeight}
                />
            );
        });

        return (
            <div>
                <style>
                    .rb-dynamic-table tbody{'{'}
                        display: block;
                        overflow-y: 'scroll'
                    {'}'}

                    .rb-dynamic-table thead, tbody tr{'{'}
                        display:table;
                        width:100%;
                        table-layout:fixed;
                    {'}'}
                </style>
                <table className="rb-dynamic-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody style={ { display: 'block', overflowY: 'scroll', maxHeight: visibleHeight } } onScroll={ this.onScroll }>
                        <tr style={ { height: topPadding } }>
                            <td></td>
                        </tr>
                        { rows }
                        <tr style={ { height: bottomPadding } }>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

const TableRow = (props) => {
    return (
    <tr style={ { height: props.rowHeight } }>
        <td>
        { props.data.id }
        </td>
        <td>
        { props.data.name }
        </td>
    </tr>
    );
};

export default Table;