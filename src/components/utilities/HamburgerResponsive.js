import React, { Component } from 'react';

class HamburgerResponsive extends Component {
    constructor(props){
        super(props);
        this.toggleComponent = props.toggleComponent || <span>Toggle</span>;
        this.state = {
            required: false,
            open: false
        };

        this.onToggle = this.onToggle.bind(this);
        this.updateRequired = this.updateRequired.bind(this);
    }
    componentWillMount() {
        this.updateRequired();
    }
    componentDidMount() {
        window.addEventListener("resize", this.updateRequired);
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateRequired);
    }
    getBrowserWidth() {
        return Math.max(
            document.body.scrollWidth,
            document.documentElement.scrollWidth,
            document.body.offsetWidth,
            document.documentElement.offsetWidth,
            document.documentElement.clientWidth
        );
    }
    updateRequired(){
        var width = this.getBrowserWidth();
        var isRequired = (width < this.props.maxWidth);

        this.setState((prevState, props) => ({
            required: isRequired,
            open: (isRequired && prevState.open)
        }));
    }
    onToggle(e){
        e.preventDefault();
        this.toggle();
    }
    toggle(){
        this.setState((prevState, props) => ({
           open: !prevState.open
        }));
    }
    renderToggleButton(){
        if(this.state.required) {
            return <div className="hamburger__toggle" onClick={this.onToggle}>
                {this.toggleComponent}
            </div>
        }

        return null;
    }
    render() {
        return <div className="hamburger__container" data-hamburger-open={ this.state.open }>
            {this.renderToggleButton()}
            <div className="hamburger__navContainer">
                {this.props.children}
            </div>
        </div>
    }
}

export default HamburgerResponsive;