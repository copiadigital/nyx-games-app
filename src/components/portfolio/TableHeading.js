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
            <th style={ { width: width }} className={ props.headingClassName }>
                <div style={ { width: width }}><span>{ content }</span></div>
            </th>
        );
    }
}

TableColumn.defaultProps = {
    heading: null,
    headingClassName: null,
    width: 150
};

export default TableColumn;