import React, { Component } from 'react';
import ThreadView from './ThreadView';
import ThreadListView from './ThreadListView';
import InboxSidebar from './InboxSidebar';
class Inbox extends Component {
    render () {
        return (
            <div className="f">
                <InboxSidebar/>
                <ThreadListView inboxId={this.props.match.params.inboxId}/>
                <ThreadView threadId={this.props.match.params.threadId || null}/>
            </div>
        );
    }
}
export default Inbox;
//now the redux integration layer
// import { connect } from 'react-redux'
// function mapStateToProps (state) {
//     return {
//         user: state.user
//     };
// }
//
// const mapDispatchToProps = (dispatch, ownProps) => ({
// });
//
// export default connect(mapStateToProps, mapDispatchToProps)(Inbox);