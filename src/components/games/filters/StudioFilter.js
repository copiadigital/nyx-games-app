import React, { Component } from 'react';
import { DropdownList } from 'react-widgets';
import studios from '../../../data/studios';
import 'react-widgets/dist/css/react-widgets.css';

class StudioFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            options: []
        };

        this.onChangeHandler = this.onChangeHandler.bind(this);
    }
    componentDidMount() {
        this.loadOptions(this.props);
    }
    loadOptions(props) {
        this.setState({ loading: true });

        studios.all({
            params: {
                itemsPerPage: 100,
                sort: {'inHouse': 'desc', 'order': 'asc', 'name': 'asc' }
            }
        })
            .then((res) => {
                this.setState({
                    loading: false,
                    options: res.data.studios
                });
            });
    }
    onChangeHandler(value) {
        var studioId = (value.id === '*')? null : value.id;
        this.props.setFilter({ studio: studioId });
    }
    renderGroupHeading(group){
        if(group.item === '*'){
            return null;
        }

        return <span>{((group.item)? 'In-house studios' : '3rd party studios')}</span>
    }
    render() {
        // force to number for strict matching
        const studio = this.props.studio? this.props.studio : null;
        const options = [{id: '*', name: 'All Studios', inHouse: '*'}, ...this.state.options];

        return (
            <fieldset>
                <label>Studio:</label>
                <DropdownList
                    value={studio}
                    data={options}
                    valueField="id"
                    textField="name"
                    placeholder="Select.."
                    groupComponent={this.renderGroupHeading}
                    groupBy={studio => studio.inHouse}
                    onChange={ this.onChangeHandler }
                    disabled={ this.props.disabled }
                    className="ddl__hasAllOption"
                />
            </fieldset>
        );
    }
}

export default StudioFilter;