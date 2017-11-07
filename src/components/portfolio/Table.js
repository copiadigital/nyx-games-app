import React, {Component} from 'react';


class Table extends Component {
    constructor() {
        super();
        this.state = {
            data: [{
                id: 1,
                name: "Row 1"
            }, {
                id: 2,
                name: "Row 2"
            }]
        }
    }

    render() {
        let rows = this.state.data.map(person => {
            return (
                <PersonRow key={person.id} data={person} />
            );
        });

        return (
            <table >
                <tbody>
                    { rows }
                </tbody>
            </table>
        );
    }
}

const PersonRow = (props) => {
    return (
    <tr>
    <td>
    { props.data.id }
    </td>
    <td>
    { props.data.name }
    </td>
    </tr>
    );
};

export default Table;