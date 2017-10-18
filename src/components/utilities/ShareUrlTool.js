import React, { Component } from 'react';
import Modal from 'react-modal';
import clipboardIcon from '../../assets/images/icon-clipboard.svg';
import ClipboardButton from 'react-clipboard.js';

class ShareUrlTool extends Component {
    constructor(props){
        super(props);

        this.state = {
            open: (this.props.open),
            error: false
        };

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.error = this.error.bind(this);
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            open: (this.props.open)
        });
    }
    open() {
        this.setState({ open: true });
    }
    close() {
        this.setState({ open: false });
    }
    error(){
        this.setState({ error: true });
    }
    render() {
        const className = this.props.className? this.props.className : 'url-share-tool';
        const title = this.props.title? this.props.title : 'Share URL';

        return (
            <div className={className} title={title} onClick={this.open}>
                <span role="img" aria-label="Share">&#10138;</span>
                {this.renderModal()}
            </div>
        );
    }
    renderModal() {
        const url = this.props.url;
        const title = this.props.title? this.props.title : 'Share URL';
        const error = this.state.error;

        return <Modal
            isOpen={this.state.open}
            onRequestClose={this.close}
            contentLabel={title}
            className="modal share-url-tool-modal"
            overlayClassName="modal-overlay"
        >
            <h2>URL for game</h2>
            <input id="url" type="text" value={url} />
            <ClipboardButton className="copy" data-clipboard-text={url} onSuccess={this.close} onError={this.error}>
                <img class="clipboard" src={clipboardIcon} alt="Copy to clipboard" />
            </ClipboardButton>
            {(error)? <p>Your browser does not support copying by click, please press Ctrl+C to copy the URL</p> : null}
        </Modal>
    }
}

export default ShareUrlTool;