import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import ThreadItem from './ThreadItem';
class ThreadListView extends Component {
    componentDidMount() {
        this.props.fetchInbox(this.props.inboxId);
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.inboxId !== this.props.inboxId)
            this.props.fetchInbox(nextProps.inboxId);
    }
    handleOnClick = (threadId) => {
        this.props.history.push(`/inbox/${this.props.inboxId}/${threadId}`)
    }
    render () {
        let inboxId = this.props.inboxId;
        if(this.props.inbox[inboxId]===undefined || this.props.inbox[inboxId].contents === undefined)
            return (<div className="inbox-column center">
                <div className="top-right">
                    Inbox loading...
                    <p>{this.props.isMobile &&  <a onClick={this.props.toggleSidebar}>toggle sidebar</a>}</p>
                </div>
            </div>);
        let inboxContents = this.props.inbox[inboxId].contents;
        console.log(inboxContents);


        let threadList = inboxContents.threads.map((thread)=>{
            if(!thread.snippet) return(null);
            return(
                <div onClick={()=>{this.handleOnClick(thread.id)}}>
                    <ThreadItem thread={thread} inboxId={inboxId} active={parseInt(this.props.threadId,10)==thread.id}/>
                </div>)
        });

        return (
            <div className="inbox-column center">
                <div className="top-right">
                    hello. viewing inbox: {inboxContents.name}

                    <p>{this.props.isMobile &&  <a onClick={this.props.toggleSidebar}>toggle sidebar</a>}</p>
                    </div>
                <div className="inbox-column-bottom">
                    {threadList}
                </div>
            </div>

        );
    }
}

//now the redux integration layer
import { connect } from 'react-redux'
import { fetchInbox } from '../../actions/inbox';
function mapStateToProps (state) {
    return {
        user: state.user,
        inbox: state.inbox
    };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    fetchInbox: (inboxId) => {
        dispatch(fetchInbox(inboxId));
    }
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ThreadListView));