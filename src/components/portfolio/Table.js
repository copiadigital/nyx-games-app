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
            range: null,
            data: []
        }

        this.onScrollBody = this.onScrollBody.bind(this);
        this.onScrollFixedBody = this.onScrollFixedBody.bind(this);
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
            range: null,
            data: []
        }, callback);
    }

    draw(){
        var range = this.getCurrentRowRange();
        this.updateRowsForRange(range);
    }

    drawFixedBodyScrollBarBorder(){
        // set border on tbody fixed to account for scrollbar
        if(this.refs.fixedTBody) {
            var scrollbarHeight = this.refs.tbody.offsetHeight - this.refs.tbody.clientHeight;
            this.refs.fixedTBody.style.borderBottom = scrollbarHeight + 'px solid ' + this.props.scrollbarBorderColor;
        }
    }

    scrollElements(left, top){
        // offset headings to match tbody scroll
        this.refs.thead.scrollLeft = left;

        // offset fixed rows to match rows
        if(this.refs.fixedTBody && this.refs.fixedTBody.scrollTop !== top) {
            this.preventScrollEvent = true;
            this.refs.fixedTBody.scrollTop = top;
        }

        if(this.refs.tbody.scrollTop !== top) {
            this.preventScrollEvent = true;
            this.refs.tbody.scrollTop = top;
        }
    }

    componentWillMount(){
        this.draw();
    }

    componentDidUpdate(){
        // this.scrollElements(this.state.offsetLeft, this.state.offsetTop);
        this.drawFixedBodyScrollBarBorder();
    }

    componentDidMount(){
        this.drawFixedBodyScrollBarBorder();
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
        var bufferStartDiff = bufferStart - start;
        var bufferEnd = end + this.props.rowBuffer * 2 + bufferStartDiff;

        return { start: start, end: end, bufferStart: bufferStart, bufferEnd: bufferEnd };
    }

    updateRowsForRange(range){
        var self = this;

        this.props.dataProvider.getItems(range.bufferStart, range.bufferEnd).then(function(result){
            self.setState({
                data: result.items,
                totalItems: result.total,
                range: range
            });
        }).catch(function(err){
            console.error('Error updating rows for range', err);

            self.setState({
                data: []
            });
        });
    }

    onScrollBody(e, number, view){
        if(this.preventScrollEvent){
            this.preventScrollEvent = false;
            return;
        }

        var offsetTop = e.target.scrollTop;
        var offsetLeft = e.target.scrollLeft;

        this.getDelayedTopScrollOffsetTrigger()(offsetTop);
        this.getHorizontalOffsetTrigger()(offsetLeft);
        this.scrollElements(offsetLeft, offsetTop);
    }

    onScrollFixedBody(e, number, view){
        if(this.preventScrollEvent){
            this.preventScrollEvent = false;
            return;
        }

        var offsetTop = e.target.scrollTop;
        var offsetLeft = this.refs.tbody.scrollLeft;

        this.getDelayedTopScrollOffsetTrigger()(offsetTop);
        this.scrollElements(offsetLeft, offsetTop);
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
            self.setState({offsetTop: offset}, function () {
                var prevRange = self.state.range;
                var currentRange = self.getCurrentRowRange();
                var buffer = self.props.rowBuffer;

                // only update if we're near the buffers
                if(prevRange === null || buffer === 0 || currentRange.start < prevRange.start - prevRange.bufferStart * 0.2 || currentRange.end > prevRange.bufferEnd - prevRange.end * 0.2) {
                    self.updateRowsForRange(currentRange);
                }
            });
        };
    }

    getDelayedTopScrollOffsetTrigger(){
        if(typeof this.delayedTopScrollOffsetTrigger !== 'function'){
            this.delayedTopScrollOffsetTrigger = _.debounce(this.getTopScrollOffsetTrigger(), 100);
        }

        return this.delayedTopScrollOffsetTrigger;
    }

    shouldComponentUpdate(nextProps, nextState){
        if(false === _.isEqual(nextProps, this.props)){
            return true;
        }

        if(nextState.data !== this.state.data){
            return true;
        }

        if(nextState.totalItems !== this.state.totalItems){
            return true;
        }

        if(false === _.isEqual(nextState.range, this.state.range)){
            return true;
        }

        return false;
    }

    render() {
        const range = this.getCurrentRowRange();
        const total = this.state.totalItems;
        const visibleHeight = this.props.rowHeight * this.props.rowsToRender;
        const topPadding = range.bufferStart * this.props.rowHeight;
        const bottomPadding = Math.max(0, (total - range.bufferEnd)) * this.props.rowHeight;

        var fixedColumnOptions = this.props.columns.slice(0, this.props.fixedColumns);
        var columnOptions = this.props.columns.slice(this.props.fixedColumns, this.props.columns.length);
        var fixedColumnWidthTotal = _.reduce(_.pluck(fixedColumnOptions, 'width'), reduceTotalWithDefault(TableColumn.defaultWidth), 0); //200;

        let rows = this.state.data.map(data => {
            return <TableRow key={ data.id } rowHeight={ this.props.rowHeight } tableColumn={ TableColumn } columns={ columnOptions } data={ data } />
        });

        let headings = columnOptions.map(column => {
            return <TableHeading key={ column.id } {...column} />
        });

        let fixedRows = this.state.data.map(data => {
            return <TableRow key={ data.id } rowHeight={ this.props.rowHeight } tableColumn={ TableColumn } columns={ fixedColumnOptions } data={ data } />
        });

        let fixedHeadings = fixedColumnOptions.map(column => {
            return <TableHeading key={ column.id } {...column} />
        });

        let classes = this.props.className.split(' ');
        classes.push('rb-dynamic-table');

        return (
            <div className={classes.join(' ')} style={ { display: 'flex' } }>
                <style>
                    .rb-dynamic-table thead tr, tbody tr{'{'}
                        display:table;
                        width:100%;
                        table-layout:fixed;
                    {'}'}
                </style>

                { (this.props.fixedColumns > 0) ?
                <div className="fixed-container" style={ { width: fixedColumnWidthTotal } }>
                    <table className="fixed" cellPadding={0} cellSpacing={0} style={ { width: fixedColumnWidthTotal } }>
                        <thead style={ { display: 'block', overflow: 'hidden', width: fixedColumnWidthTotal + 20 }}>
                        <tr>
                            { fixedHeadings }
                        </tr>
                        </thead>
                        <tbody ref="fixedTBody" onScroll={ this.onScrollFixedBody } style={ { display: 'block', overflowX: 'hidden', overflowY: 'auto', maxHeight: visibleHeight, width: fixedColumnWidthTotal + 20 } } >
                        <tr className="pad" style={ { height: topPadding } }>
                            <td></td>
                        </tr>
                        { fixedRows }
                        <tr className="pad" style={ { height: bottomPadding } }>
                            <td></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                    : null }

                <div className="body-container" style={ {} }>
                    <table className="body" cellPadding={0} cellSpacing={0}>
                        <thead ref="thead" style={ { display: 'block', overflow: 'hidden' }}>
                            <tr>
                                { headings }
                            </tr>
                        </thead>
                        <tbody ref="tbody" style={ { display: 'block', overflowX: 'auto', overflowY: 'auto', maxHeight: visibleHeight } } onScroll={ this.onScrollBody }>
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
            </div>
        );
    }
}

Table.defaultProps = {
    fixedColumns: 0,
    rowHeight: 25,
    rowsToRender: 25,
    rowBuffer: 25,
    scrollbarBorderColor: '#a4a4a4'
};

Table.propTypes = {
    dataProvider: PropTypes.object.isRequired,
    fixedColumns: PropTypes.number,
    tableHeadRow: PropTypes.func,
    tableRow: PropTypes.func,
    tableColumn: PropTypes.func,
    rowHeight: PropTypes.number,
    rowsToRender: PropTypes.number,
    rowBuffer: PropTypes.number,
    scrollbarBorderColor: PropTypes.string
};

var reduceTotalWithDefault = function(def){
    return function(total, num){
        if(isNaN(num)) {
            num = def;
        }

        return total + num;
    }
};

export default Table;