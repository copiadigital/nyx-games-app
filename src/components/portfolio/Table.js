import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';


class Table extends Component {
    constructor(props) {
        super(props);

        this.state = {
            offset: 0,
            totalItems: 0,
            data: []
        }

        this.onScroll = this.onScroll.bind(this);
    }

    reset(){
        var self = this;
        this.clear(function(){
            self.draw();
        });
    }

    clear(callback){
        this.setState({
            offset: 0,
            totalItems: 0,
            data: []
        }, callback);
    }

    draw(){
        var range = this.getCurrentRowRange();
        this.updateRowsForRange(range);
    }

    componentWillMount(){
        this.draw();
    }

    componentWillReceiveProps(nextProps){
        this.reset();
    }

    getCurrentRowRange(){
        return this.getRowRangeForOffset(this.state.offset);
    }

    getRowRangeForOffset(offset){
        var start = Math.floor(offset / this.props.rowHeight);
        var end = start + this.props.rowsToRender;

        var bufferStart = Math.max(0, start - this.props.rowBuffer);
        var bufferEnd = end + this.props.rowBuffer;

        return { start: start, end: end, bufferStart: bufferStart, bufferEnd: bufferEnd };
    }

    updateRowsForRange(range){
        var self = this;

        this.props.dataProvider.getItems(range.bufferStart, range.bufferEnd).then(function(result){
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
            this._delayedScrollOffsetTrigger = (this.props.scrollDebounce > 0)? _.debounce(trigger, this.props.scrollDebounce) : trigger;
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
        const visibleHeight = this.props.rowHeight * this.props.rowsToRender;
        const topPadding = range.bufferStart * this.props.rowHeight;
        const bottomPadding = Math.max(0, (total - range.bufferEnd)) * this.props.rowHeight;

        let rows = this.state.data.map(item => {
            return (
                <TableRow
                    key={item.id}
                    data={item}
                    rowHeight={this.props.rowHeight}
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

Table.defaultProps = {
    rowHeight: 25,
    rowsToRender: 25,
    rowBuffer: 25,
    scrollDebounce: 100
};

Table.propTypes = {
    dataProvider: PropTypes.object.isRequired,
    rowHeight: PropTypes.number,
    rowsToRender: PropTypes.number,
    rowBuffer: PropTypes.number,
    scrollDebounce: PropTypes.number
};

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