import React, { Component } from 'react';
import Modal from 'react-modal';

class ErrorModal extends Component {

    render() {
        var props = this.props;
        let isOpen = (typeof props.isOpen === 'undefined')? true : props.isOpen;
        let contentLabel = (typeof props.contentLabel === 'undefined')? 'Error' : props.contentLabel;
        let className = (typeof props.className === 'undefined')? '' : props.className;
        className += ' modal modal-error';

        let errorTitle = (typeof props.errorTitle === 'undefined')? 'Error' : props.errorTitle;
        let errorContent = (typeof props.children === 'undefined')? <p>Ooops, an expected error occurred, please refresh the page and try again.</p> : props.children;

        return <Modal {...props} isOpen={isOpen} contentLabel={contentLabel} className={className}>
            <h1>{errorTitle}</h1>
            {errorContent}
        </Modal>
    }
}

export default ErrorModal;