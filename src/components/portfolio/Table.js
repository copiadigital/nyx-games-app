import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import TableRow from './TableRow';
import TableColumn from './TableColumn';
import TableHeading from './TableHeading';


class Table extends Component {
    constructor(props) {
        super(props);

        this.state = {
            offsetTop: 0,
            offsetLeft: 0,
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
            offsetTop: 0,
            offsetLeft: 0,
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

    componentDidUpdate(){
        // offset headings to match tbody scroll
        this.refs.thead.scrollLeft = this.state.offsetLeft;
    }

    componentWillReceiveProps(nextProps){
        this.reset();
    }

    getCurrentRowRange(){
        return this.getRowRangeForOffset(this.state.offsetTop);
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
        var offsetTop = e.target.scrollTop;
        this.getDelayedTopScrollOffsetTrigger()(offsetTop);

        var offsetLeft = e.target.scrollLeft;
        this.getHorizontalOffsetTrigger()(offsetLeft);        
    }

    getHorizontalOffsetTrigger(){
        var self = this;
        return function(offset) {
            self.setState({offsetLeft: offset});
        };
    }

    getTopScrollOffsetTrigger(){
        var self = this;
        return function(offset) {
            self.setState({offsetTop: offset, waitForRowUpdate: true}, function (newState) {
                var range = self.getCurrentRowRange();
                self.updateRowsForRange(range);
            });
        };
    }

    getDelayedTopScrollOffsetTrigger(){
        if(!this._delayedScrollOffsetTrigger){
            var trigger = this.getTopScrollOffsetTrigger();
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

        let rows = this.state.data.map(data => {
            return <TableRow key={ data.id } rowHeight={ this.props.rowHeight } tableColumn={ TableColumn } columns={ this.props.columns } data={ data } />
        });

        let headings = this.props.columns.map(column => {
            return <TableHeading key={ column.id } {...column} />
        });

        let classes = this.props.className.split(' ');
        classes.push('rb-dynamic-table');

        return (
            <div>
                <style>
                    .rb-dynamic-table thead tr, tbody tr{'{'}
                        display:table;
                        width:100%;
                        table-layout:fixed;
                    {'}'}
                </style>
                <table className={classes.join(' ')} cellPadding={0} cellSpacing={0}>
                    <thead ref="thead" style={ { display: 'block', overflow: 'hidden' }}>
                        <tr>
                            { headings }
                        </tr>
                    </thead>
                    <tbody style={ { display: 'block', overflowX: 'auto', overflowY: 'auto', maxHeight: visibleHeight } } onScroll={ this.onScroll }>
                        <tr className="pad" style={ { height: topPadding } }>
                            <td></td>
                        </tr>
                        { rows }
                        <tr className="pad" style={ { height: bottomPadding } }>
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
    tableHeadRow: PropTypes.func,
    tableRow: PropTypes.func,
    tableColumn: PropTypes.func,
    rowHeight: PropTypes.number,
    rowsToRender: PropTypes.number,
    rowBuffer: PropTypes.number,
    scrollDebounce: PropTypes.number
};

export default Table;