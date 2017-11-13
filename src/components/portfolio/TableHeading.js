import React, {Component} from 'react';

class TableColumn extends Component {
    resolveContent(){
        var props = this.props;

        if(typeof props.heading === 'function'){
            return props.heading(props.data, props);
        }

        if(props.heading === null){
            return props.id;
        }

        return props.heading;
    }
    render(){
        var props = this.props;
        const width = props.width;
        const content = this.resolveContent();

        return (
            <th style={ { width: width }} className={ props.className }>
                <div><span>{ content }</span></div>
            </th>
        );
    }
}

TableColumn.defaultProps = {
    heading: null,
    width: 150
};

export default TableColumn;