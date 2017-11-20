import React, {Component} from 'react';
import TableColumn from './TableColumn';
import TableRow from "./TableRow";
import _ from 'underscore';

class TableBody extends Component {
    constructor(props){
        super(props);

        this.state = {
            offsetTop: 0,
            totalItems: 0,
            data: [],
        };

        this.onScroll = this.onScroll.bind(this);
    }
    componentWillMount(){
        var self = this;

        this.props.dataProvider.addListener('updateItems', function(result){
            self.setState({
                data: result.items,
                totalItems: result.total
            });
        });

        this.props.table.events.addListener('offsetUpdate', function(offset){
           self.scrollTo(offset);
        });

        this.props.table.events.addListener('scrollBarHeight', function(height, table){
            self.drawScrollBarBorder(height, table);
        });
    }
    componentDidUpdate(){
        this.emitScrollBarHeight();
    }
    componentDidMount(){
        this.emitScrollBarHeight();
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

        return false;
    }
    emitScrollBarHeight(){
        var scrollbarHeight = this.refs.tbody.offsetHeight - this.refs.tbody.clientHeight;
        this.props.table.events.emit('scrollBarHeight', scrollbarHeight, this);
    }
    drawScrollBarBorder(height, table){
        if(this.props.overflowX === 'hidden' && this !== table && this.refs.tbody){
            this.refs.tbody.style.borderBottom = height + 'px solid ' + this.props.scrollbarBorderColor;
        }
    }
    onScroll(e){
        if(this.preventScrollBodyEvent){
            this.preventScrollBodyEvent = false;
            return;
        }

        this.props.onScroll(e);
    }
    scrollTo(offset){
        if(this.refs.tbody && this.refs.tbody.scrollLeft !== offset.left) {
            this.preventScrollBodyEvent = true;
            this.refs.tbody.scrollLeft = offset.left;
        }

        if(this.refs.tbody && this.refs.tbody.scrollTop !== offset.top) {
            this.preventScrollBodyEvent = true;
            this.refs.tbody.scrollTop = offset.top;
        }

        this.setState({
            offsetTop: offset.top
        });
    }
    getCurrentRowRange(){
        return this.getRowRangeForOffset(this.state.offsetTop);
    }
    getRowRangeForOffset(offset){
        var start = Math.floor(offset / this.props.rowHeight);
        var end = start + this.props.rowsToRender - 1;

        var bufferStart = Math.max(0, start - this.props.rowBuffer);
        var bufferStartDiff = bufferStart - start;
        var bufferEnd = end + this.props.rowBuffer * 2 + bufferStartDiff;

        return { start: start, end: end, bufferStart: bufferStart, bufferEnd: bufferEnd };
    }
    render(){
        const props = this.props;

        const range = this.getCurrentRowRange();
        const total = this.state.totalItems;
        const visibleHeight = props.rowHeight * props.rowsToRender;
        const topPadding = range.bufferStart * props.rowHeight;
        const bottomPadding = Math.max(0, (total - range.bufferEnd)) * props.rowHeight;

        let rows = this.state.data.map(data => {
            return <TableRow key={ data.id } rowHeight={ props.rowHeight } tableColumn={ TableColumn } columns={ props.columns } data={ data } />
        });

        return (
            <tbody ref="tbody" onScroll={ this.onScroll } style={ { display: 'block', overflowX: props.overflowX, overflowY: props.overflowY, maxHeight: visibleHeight, width: props.width} } >
            <tr className="pad" style={ { height: topPadding } }>
                <td></td>
            </tr>
            { rows }
            <tr className="pad" style={ { height: bottomPadding } }>
                <td></td>
            </tr>
            </tbody>
        );
    }
}

TableBody.defaultProps = {
    hideYScrollbar: false,
    overflowX: 'auto',
    overflowY: 'auto',
    rowBuffer: 0,
    rowHeight: 25,
    rowsToRender: 20,
    scrollbarBorderColor: '#a4a4a4',
    width: null
}

var reduceTotalWithDefault = function(def){
    return function(total, num){
        if(isNaN(num)) {
            num = def;
        }

        return total + num;
    }
};

export default TableBody;