import React, { Component } from 'react';
import { Link } from 'react-router-dom';
class ThreadListView extends Component {
    render () {
        return (
            <div className="inbox-column center">
                <div className="top-right">hello. viewing inbox: {this.props.inboxId}</div>
                <div className="inbox-column-bottom">
                    <div className="inbox-thread-list-item-wrapper">
                        <div className="inbox-thread-list-item">FROM NAME<br/><Link to={`/inbox/${this.props.inboxId}/th1`}>th1</Link></div>
                    </div>
                    <div className="inbox-thread-list-item-wrapper">
                        <div className="inbox-thread-list-item">FROM NAME {this.props.inboxId}<br/>hi</div>
                    </div>
                    <div className="inbox-thread-list-item-wrapper">
                        <div className="inbox-thread-list-item">FROM NAME<br/>hi</div>
                    </div>
                    <div className="inbox-thread-list-item-wrapper">
                        <div className="inbox-thread-list-item">FROM NAME<br/>hi</div>
                    </div>
                    <div className="inbox-thread-list-item-wrapper">
                        <div className="inbox-thread-list-item">FROM NAME<br/>hi</div>
                    </div>
                    <div className="inbox-thread-list-item-wrapper">
                        <div className="inbox-thread-list-item">FROM NAME<br/>hi</div>
                    </div>
                    <div className="inbox-thread-list-item-wrapper">
                        <div className="inbox-thread-list-item">FROM NAME<br/>hi</div>
                    </div>
                    <div className="inbox-thread-list-item-wrapper">
                        <div className="inbox-thread-list-item">FROM NAME<br/>hi</div>
                    </div>
                    <div className="inbox-thread-list-item-wrapper">
                        <div className="inbox-thread-list-item">FROM NAME<br/>hi</div>
                    </div>
                    <div className="inbox-thread-list-item-wrapper">
                        <div className="inbox-thread-list-item">FROM NAME<br/>hi</div>
                    </div>
                    <div className="inbox-thread-list-item-wrapper">
                        <div className="inbox-thread-list-item">FROM NAME<br/>hi</div>
                    </div>
                    <div className="inbox-thread-list-item-wrapper">
                        <div className="inbox-thread-list-item">FROM NAME<br/>hi</div>
                    </div>
                </div>
            </div>

        );
    }
}

//now the redux integration layer
import { connect } from 'react-redux'
function mapStateToProps (state) {
    return {
        user: state.user
    };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ThreadListView);