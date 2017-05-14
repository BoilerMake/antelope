import React, { Component } from 'react';
import ThreadView from './ThreadView';
import ThreadListView from './ThreadListView';
import InboxSidebar from './InboxSidebar';
class Inbox extends Component {
    render () {
        let threadId = this.props.match.params.threadId || null;
        let inboxId = this.props.match.params.inboxId;
        if(this.props.isMobile) {
            const sidebar = <InboxSidebar isMobile toggleSidebar={this.props.toggleSidebar}/>;
            const body = (threadId
                ? <ThreadView threadId={threadId} inboxId={inboxId} isMobile/>
                : <ThreadListView inboxId={inboxId} isMobile toggleSidebar={this.props.toggleSidebar}/>);
            return (
                <div className="f">
                    {this.props.sidebar ? sidebar : body}
                </div>
            );
        }
        else {
            //desktop layout
            return (
                <div className="f">
                    <InboxSidebar/>
                    <ThreadListView threadId={threadId} inboxId={inboxId}/>
                    <ThreadView threadId={threadId} inboxId={inboxId}/>
                </div>
            );
        }
    }
}
// export default Inbox;
// now the redux integration layer
import { toggleSidebar } from '../../actions/system'
import { connect } from 'react-redux'
function mapStateToProps (state) {
    return {
        sidebar: state.system.sidebar,
        isMobile: state.system.mobile
    };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    toggleSidebar: () => {
        dispatch(toggleSidebar());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Inbox);