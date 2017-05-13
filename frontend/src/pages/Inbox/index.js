import React, { Component } from 'react';
import ThreadView from './ThreadView';
import ThreadListView from './ThreadListView';
import InboxSidebar from './InboxSidebar';
class Inbox extends Component {
    constructor() {
        super();
        this.state = {
            width: window.innerWidth,
            sidebar: false
        };
    }
    componentWillMount() {
        window.addEventListener('resize', this.handleWindowSizeChange);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowSizeChange);
    }
    handleWindowSizeChange = () => {
        this.setState({ width: window.innerWidth });
    };
    toggleSidebar = () => {
        this.setState({sidebar: !this.state.sidebar});
    };
    render () {
        const { width } = this.state;
        const isMobile = width <= 500;
        let threadId = this.props.match.params.threadId || null;
        let inboxId = this.props.match.params.inboxId;
        if(isMobile) {
            let body = threadId
                ? <ThreadView threadId={threadId} inboxId={inboxId} isMobile/>
                : <ThreadListView inboxId={inboxId} isMobile toggleSidebar={this.toggleSidebar}/>;
            return (
                <div className="f">
                    {this.state.sidebar ? <InboxSidebar isMobile toggleSidebar={this.toggleSidebar}/> : body}

                </div>
            );
        }
        else {
            //desktop
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