import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MessageItem from './MessageItem';
import Draft from './Draft';
import moment from 'moment';
import ThreadAssignmentsModal from './ThreadAssignmentsModal';
class ThreadView extends Component {
    constructor () {
        super();
        this.state = {
            showAssignmentsModal: false
        };
        this.handleOpenAssignmentsModal = this.handleOpenAssignmentsModal.bind(this);
        this.handleCloseAssignmentsModal = this.handleCloseAssignmentsModal.bind(this);
    }
    handleOpenAssignmentsModal () {
        this.setState({ showAssignmentsModal: true });
    }

    handleCloseAssignmentsModal () {
        this.setState({ showAssignmentsModal: false });
    }

    componentDidMount() {
        this.props.fetchThread(this.props.threadId);
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.threadId !== this.props.threadId)
            this.props.fetchThread(nextProps.threadId);
    }
    render () {
        const UserEvent = ({event}) => {
            const date = moment.utc(event.created_at,'YYYY-MM-DD HH:mm:ss').local();
            let dateString = date.calendar();

            switch (event.type) {
                case 'assign_thread':
                    return (<div><strong>{event.user.displayName}</strong> <i>assigned</i> the thread to <strong>{event.target.displayName}</strong> {dateString}</div>)
                case 'unassign_thread':
                    return (<div><strong>{event.user.displayName}</strong> <i>unassigned</i> the thread to <strong>{event.target.displayName}</strong> {dateString}</div>)
                default:
                    return (<div><strong>{event.user.displayName}</strong> {event.type} {dateString}</div>);
            }
        };
        const mobileBackLink = (this.props.isMobile && <Link to={`/inbox/${this.props.inboxId}`}>back to inbox</Link>);
        const threadId = this.props.threadId;
        let thread = this.props.thread[threadId];
        if(threadId===null){
            return (
                <div className="col right">
                    <div className="col-bottom">
                        {mobileBackLink}
                        no thread selected
                    </div>
                </div>
            );
        }
        if(thread===undefined || (thread.contents === undefined && !thread.isError))
            return (
                <div className="col right">
                    <div className="col-bottom">
                        {mobileBackLink}
                        <h2>loading!</h2>
                    </div>
                </div>
            );
        if(thread.isError)
            return (
                <div className="col right">
                    <div className="col-bottom">
                        {mobileBackLink}
                        <h2>Error! {thread.error_message}</h2>
                    </div>
                </div>
            );
        let threadContents = thread.contents;
        let messageList = threadContents.messages.map(message => {
            return(
                <MessageItem message={message} key={"m"+message.id}/>
            )
        });
        let userEventList = threadContents.user_events.map(e => {
            return(
                <UserEvent event={e} key={"e"+e.id}/>
            )
        });
        let draftList = threadContents.drafts.map(d => {
            return(
                <Draft draft={d} update={this.props.updateDraft} key={"d"+d.id}/>
            )
        });

        let AssignmentsModal = (<ThreadAssignmentsModal
            isOpen={this.state.showAssignmentsModal}
            close={this.handleCloseAssignmentsModal}
            fetch={()=>{this.props.fetchThreadAssignments(threadId)}}
            updateAssignments={(data)=>{this.props.updateThreadAssignments(threadId,data)}}
            thread={thread}/>);

        return (
            <div className="col right">
                <div className="col-bottom" style={{padding: '20px'}}>
                    {mobileBackLink}
                    {this.props.threadId ? null : 'no threaad selected'}

                    {AssignmentsModal}
                    <div className="threadview-header">
                        <div>
                            <div className="threadview-subject">{threadContents.snippet.subject}</div>
                            <div className="threadview-sender">{threadContents.snippet.from}</div>
                        </div>
                        <div style={{"alignSelf":"flex-end"}}>
                            <button className="btn-primary">Notes</button>
                            <button className="btn-primary" onClick={this.handleOpenAssignmentsModal}>Assignments</button>
                        </div>
                    </div>

                    <hr/>
                    {messageList}
                    <div className="threadview-footer">
                        <button className="btn-primary" onClick={()=>{this.props.createDraft(threadId,'replyall')}}>Reply All</button>
                        <button className="btn-primary" onClick={()=>{this.props.createDraft(threadId,'reply')}}>Reply</button>
                    </div>
                    {userEventList}
                    {draftList}

                    {/*<pre>{JSON.stringify(thread.contents.user_events,null, 2)}</pre>*/}
                    {/*<div style={{width: '50%', backgroundColor: 'grey'}}>50% width</div>*/}
                </div>
            </div>
        );
    }
}

//now the redux integration layer
import { connect } from 'react-redux'
function mapStateToProps (state) {
    return {
        user: state.user,
        thread: state.thread
    };
}
import { fetchThread, fetchThreadAssignments, updateThreadAssignments, createDraft, updateDraft } from '../../actions/thread'
const mapDispatchToProps = (dispatch, ownProps) => ({
    fetchThread: (threadId) => {
        dispatch(fetchThread(threadId));
    },
    fetchThreadAssignments: (threadId) => {
        dispatch(fetchThreadAssignments(threadId));
    },
    updateThreadAssignments: (threadId,data) => {
        dispatch(updateThreadAssignments(threadId,data));
    },
    createDraft: (threadId,data) => {
        dispatch(createDraft(threadId,data));
    },
    updateDraft: (draft,action) => {
        dispatch(updateDraft(draft,action));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(ThreadView);