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
            <td style={ { width: width }}>
                <div>{ content }</div>
            </td>
        );
    }
}

TableColumn.defaultProps = {
    content: null,
    width: 150
};

export default TableColumn;