import React, {Component} from 'react';

class TableColumn extends Component {
    resolveContent(){
        var props = this.props;

        if(typeof props.content === 'function'){
            return props.content(props.data, props);
        }

        if(props.content === null){
            return (props.id in props.data)? props.data[props.id].toString() : null;
        }

        return props.content;
    }
    render(){
        var props = this.props;
        const width = props.width;
        const content = this.resolveContent();

        return (
            <td className={props.className} style={ { width: width }}>
                <div style={ { width: width }}>{ content }</div>
            </td>
        );
    }
}

TableColumn.defaultWidth = 150;

TableColumn.defaultProps = {
    content: null,
    className: null,
    width: TableColumn.defaultWidth
};

export default TableColumn;