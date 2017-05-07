import React, { Component } from 'react';
class Inbox extends Component {
    render () {
        return (
            <div>
                <h1>Inbox</h1>
                <h2>inbox:{this.props.match.params.inboxId} thread:{this.props.match.params.threadId} </h2>
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

export default connect(mapStateToProps, mapDispatchToProps)(Inbox);