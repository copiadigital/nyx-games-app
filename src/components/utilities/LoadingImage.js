import React, { Component } from 'react';
import loadingSpinnerWhite from './../../assets/images/loading-spinner-white.svg';

class LoadingImage extends Component {
    render() {
        const alt = this.props.alt? this.props.alt : '';
        const width = this.props.width? this.props.width : 50;
        const height = this.props.height? this.props.height : 50;

        return (
            <div>
                <img src={loadingSpinnerWhite} alt={alt} width={width} height={height} />
            </div>
        );
    }
}

export default LoadingImage;