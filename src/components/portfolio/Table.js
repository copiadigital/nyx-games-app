import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import TableRow from './TableRow';
import TableColumn from './TableColumn';
import TableHeading from './TableHeading';
import TableBody from "./TableBody";
import {EventEmitter} from "fbemitter";


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
        this.events = new EventEmitter();
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
        // if(this.refs.fixedTBody) {
        //     var scrollbarHeight = this.refs.tbody.offsetHeight - this.refs.tbody.clientHeight;
        //     this.refs.fixedTBody.style.borderBottom = scrollbarHeight + 'px solid ' + this.props.scrollbarBorderColor;
        // }
    }

    scrollElements(left, top){
        // offset headings to match tbody scroll
        this.refs.thead.scrollLeft = left;

        // offset fixed rows to match rows
        // if(this.refs.fixedTBody && this.refs.fixedTBody.scrollTop !== top) {
        //     this.preventScrollEvent = true;
        //     this.refs.fixedTBody.scrollTop = top;
        // }

        // if(this.refs.tbody.scrollTop !== top) {
        //     this.preventScrollEvent = true;
        //     this.refs.tbody.scrollTop = top;
        // }

        this.events.emit('offsetUpdate', { left: left, top: top });
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
                range: range
            });
        }).catch(function(err){
            console.error('Error updating rows for range', err);
        });
    }

    onScrollBody(e){
        var offsetTop = e.target.scrollTop;
        var offsetLeft = e.target.scrollLeft;

        this.getDelayedTopScrollOffsetTrigger()(offsetTop);
        this.getHorizontalOffsetTrigger()(offsetLeft);
        this.scrollElements(offsetLeft, offsetTop);
    }

    onScrollFixedBody(e){
        if(this.preventScrollFixedBodyEvent){
            this.preventScrollFixedBodyEvent = false;
            return;
        }

        var offsetTop = e.target.scrollTop;

        this.getDelayedTopScrollOffsetTrigger()(offsetTop);
        this.scrollElements(this.state.offsetLeft, offsetTop);
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
                var buffer = self.props.rowsToRender / 2;

                // only update if we're near the buffers
                if(prevRange === null || buffer === 0 || currentRange.start < prevRange.bufferStart + buffer || currentRange.end > prevRange.bufferEnd - buffer) {
                    console.log('update rows', currentRange.start, prevRange.bufferStart + buffer, currentRange.end, prevRange.bufferEnd - buffer);
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

        return false;
    }

    render() {
        const range = this.getCurrentRowRange();
        const total = this.state.totalItems;
        var fixedColumnOptions = this.props.columns.slice(0, this.props.fixedColumns);
        var columnOptions = this.props.columns.slice(this.props.fixedColumns, this.props.columns.length);
        var fixedColumnWidthTotal = _.reduce(_.pluck(fixedColumnOptions, 'width'), reduceTotalWithDefault(TableColumn.defaultWidth), 0) + 20; //200;

        let headings = columnOptions.map(column => {
            return <TableHeading key={ column.id } {...column} />
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
                        <TableBody
                            columns={fixedColumnOptions}
                            dataProvider={this.props.dataProvider}
                            offsetTop={this.state.offsetTop}
                            rowHeight={this.props.rowHeight}
                            rowsToRender={this.props.rowsToRender}
                            rowBuffer={this.props.rowBuffer}
                            onScroll={this.onScrollFixedBody}
                            table={this}
                            width={fixedColumnWidthTotal}
                        />
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
                        <TableBody
                            columns={columnOptions}
                            dataProvider={this.props.dataProvider}
                            offsetTop={this.state.offsetTop}
                            rowHeight={this.props.rowHeight}
                            rowsToRender={this.props.rowsToRender}
                            rowBuffer={this.props.rowBuffer}
                            onScroll={this.onScrollBody}
                            table={this}
                            />
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