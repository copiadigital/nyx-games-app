import React, {Component} from 'react';

class TableRow extends Component {
    render(){
        var props = this.props;
        return (
            <tr style={ { height: props.rowHeight } }>
                <td>
                    { props.data.id }
                </td>
                <td>
                    { props.data.name }
                </td>
            </tr>
        );
    }
}

export default TableRow;