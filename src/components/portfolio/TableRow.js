import React, {Component} from 'react';
import TableColumn from './TableColumn';

class TableRow extends Component {
    render(){
        const props = this.props;

        let columns = props.columns.map(column => {
            return <TableColumn key={ column.id } data={ props.data } { ...column } />
        });

        return (
            <tr style={ { height: props.rowHeight } }>
                { columns }
            </tr>
        );
    }
}

export default TableRow;