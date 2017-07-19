import React, { Component } from 'react';

class ImageLoader extends Component {
    constructor(props){
        super(props);

        this.src = this.props.src;
        this.alt = this.props.alt? this.props.alt : '';
        this.errorOutput = this.props.error? this.props.error : <img src={this.src} alt={this.props.alt} />;
        this.loadingOutput = this.props.loading? this.props.loading : null;

        this.state = {
            error: false,
            loading: true
        };

        this.onError = this.onError.bind(this);
        this.onLoad = this.onLoad.bind(this);
    }
    onError() {
        this.setState({
            error: true,
            loading: false
        });
    }
    onLoad() {
        this.setState({
            error: false,
            loading: false
        });
    }
    componentDidMount() {
        this.img = new Image();
        this.img.onload = this.onLoad;
        this.img.onerror = this.onError;
        this.img.src = this.src;
    }
    render() {
        if(this.state.loading){
            return (
                <div>
                    {this.loadingOutput}
                </div>
            );
        }

        if(this.state.error){
            return <div>{this.errorOutput}</div>;
        }

        return (
            <div>
                <img src={this.src} alt={this.alt} />
            </div>
        );
    }
}

export default ImageLoader;