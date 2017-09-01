import React, { Component } from 'react';

class SortLink extends Component {
    constructor(props) {
        super(props);

        this.state = {
            active: props.active,
            disabled: props.disabled,
            order: (props.order === 'desc')? 'desc' : 'asc'
        };

        this.handleSortAsc = this.handleSortAsc.bind(this);
        this.handleSortDesc = this.handleSortDesc.bind(this);
        this.handleSortToggle = this.handleSortToggle.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            active: nextProps.active,
            disabled: nextProps.disabled,
            order: nextProps.order,
        });
    }
    handleSortToggle(e) {
        e.preventDefault();

        if(this.state.disabled)
            return;

        if(this.state.order === 'asc'){
            this.update('desc');
        }else{
            this.update('asc');
        }
    }
    handleSortAsc(e) {
        e.preventDefault();

        if(this.state.disabled)
            return;

        this.update('asc');
    }
    handleSortDesc(e) {
        e.preventDefault();

        if(this.state.disabled)
            return;

        this.update('desc');
    }
    update(order) {
        this.setState({
            active: true,
            order: order
        });

        this.props.setFilter({
            sort: this.props.field,
            order: order
        });
    }
    render() {
        const label = this.props.label;
        const disabled = this.state.disabled;
        const active = this.state.active;
        const order = this.state.order;

        var containerClassNames = ['sort-widget'];
        var descClassNames = ['arrow', 'arrow--desc'];
        var ascClassNames = ['arrow', 'arrow--asc'];

        if(disabled){
            containerClassNames.push('disabled');
            descClassNames.push('disabled');
            ascClassNames.push('disabled');
        }else if(active && order === 'desc'){
            containerClassNames.push('active');
            descClassNames.push('arrow-active');
        }else if(active && order === 'asc'){
            containerClassNames.push('active');
            ascClassNames.push('arrow-active');
        }

        return (
            <div className={ containerClassNames.join(' ') } >
                <a href="#sortToggle" className="label" onClick={ this.handleSortToggle }>{ label } </a>
                <a href="#sortDesc" className={ descClassNames.join(' ') } onClick={ this.handleSortDesc }> desc </a>
                <a href="#sortAsc" className={ ascClassNames.join(' ') } onClick={ this.handleSortAsc }> asc </a>
            </div>
        );
    }
}

export default SortLink;