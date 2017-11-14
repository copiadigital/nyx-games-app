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

        // offset fixed rows to match rows
        this.refs.fixedBody.scrollTop = this.state.offsetTop;
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
        this.getTopScrollOffsetTrigger()(offsetTop);

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

    shouldComponentUpdate(nextProps, nextState){
        if(nextState.waitForRowUpdate === true){
            return false;
        }

        return true;
    }

    extractFixed(element){
        var fixed = [];
        var body = [];
        
        console.log('element', element);

        _.each(element, function(item){
            console.log('item', item);
            fixed.push(React.cloneElement(item, {}, item.props.children.slice(0, 1)));
            body.push(React.cloneElement(item, {}, item.props.children.slice(1)));
        });

        return [fixed, body];
    }

    render() {
        const range = this.getCurrentRowRange();
        const total = this.state.totalItems;
        const visibleHeight = this.props.rowHeight * this.props.rowsToRender;
        const topPadding = range.bufferStart * this.props.rowHeight;
        const bottomPadding = Math.max(0, (total - range.bufferEnd)) * this.props.rowHeight;

        var fixedColumnOptions = this.props.columns.slice(0, 1);
        var columnOptions = this.props.columns.slice(1, this.props.columns.length);

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

                <div className="fixed-container" style={ { width: 200 } }>
                    <table className="fixed" cellPadding={0} cellSpacing={0}>
                        <thead style={ { display: 'block', overflow: 'hidden' }}>
                        <tr>
                            { fixedHeadings }
                        </tr>
                        </thead>
                        <tbody ref="fixedBody" style={ { display: 'block', overflowX: 'scroll', overflowY: 'hidden', maxHeight: visibleHeight, width: 200} } >
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

                <div className="body-container" style={ {} }>
                    <table className="body" cellPadding={0} cellSpacing={0}>
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
            </div>
        );
    }
}

Table.defaultProps = {
    rowHeight: 25,
    rowsToRender: 25,
    rowBuffer: 25
};

Table.propTypes = {
    dataProvider: PropTypes.object.isRequired,
    tableHeadRow: PropTypes.func,
    tableRow: PropTypes.func,
    tableColumn: PropTypes.func,
    rowHeight: PropTypes.number,
    rowsToRender: PropTypes.number,
    rowBuffer: PropTypes.number
};

export default Table;