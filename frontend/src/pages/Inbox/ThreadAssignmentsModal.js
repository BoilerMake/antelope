import React, { Component } from 'react';
import ReactModal from 'react-modal';
export default class ThreadAssignmentsModal extends Component {

    render () {
        return (
            <ReactModal
                isOpen={this.props.isOpen}
                onRequestClose={this.props.close}
                shouldCloseOnOverlayClick={true}
                contentLabel="Thread Assignments">
                <button className="btn-primary" onClick={this.props.close}>Close Modal</button>
            </ReactModal>
        );
    }
}

