import React, {Component} from 'react';
import TableColumn from './TableColumn';
import TableRow from "./TableRow";
import _ from 'underscore';

class TableBody extends Component {
    constructor(props){
        super(props);

        this.state = {
            data: [],
            totalItems: 0,
            range: props.range,
            scrollBarHeight: 0
        };

        this.onScroll = this.onScroll.bind(this);
    }
    componentWillMount(){
        var self = this;

        this.props.table.events.addListener('updateItems', function(result, range){
            self.setState({
                data: result.items,
                totalItems: result.total,
                range: range
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
    emitScrollBarHeight(){
        if(this.refs.tbody) {
            var scrollbarHeight = this.refs.tbody.offsetHeight - this.refs.tbody.clientHeight;

            if(this.state.scrollBarHeight !== scrollbarHeight){
                this.setState({ scrollBarHeight: scrollbarHeight } );
            }

            this.props.table.events.emit('scrollBarHeight', scrollbarHeight, this);
        }
    }
    drawScrollBarBorder(height, table){
        if(this.props.overflowX === 'hidden' && this !== table && this.refs.tbody && this.state.scrollBarHeight !== height){
            this.setState({ scrollBarHeight: height } );
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
    }
    render(){
        const range = this.state.range;
        if(!range){
            return null;
        }

        const props = this.props;
        const total = this.state.totalItems;
        const visibleHeight = props.rowHeight * props.rowsToRender + this.state.scrollBarHeight;
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