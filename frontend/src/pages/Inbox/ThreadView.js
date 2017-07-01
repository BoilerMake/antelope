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
            const dateString = date.format("ddd, MMMM Do YYYY, h:mm:ss a");

            let context;
            if (event.type === 'assign_thread')
                context = (<span><i>assigned</i> the thread to <strong>{event.target.displayName}</strong></span>);
            else if (event.type === 'unassign_thread')
                context = (<span><i>unassigned</i> the thread to <strong>{event.target.displayName}</strong></span>);
            else if (event.type === 'create_draft')
                context = (<span><i>created a draft</i></span>);
            else if (event.type === 'send_draft')
                context = (<span><i>sent a draft</i></span>);
            else
                context = (<span>{event.type}</span>);
            return (<div className="threaditem--userEventItem"><strong>{event.user.displayName}</strong> {context} on {dateString}</div>);
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
        const { readOnly } = threadContents;
        let comboList = [];
        let numMessages = 0;
        for(let item of threadContents.combo) {
            let x =  item.content;
            if(item.type==="message") {
                comboList.push(<MessageItem message={x} key={"m" + x.id}/>);
                numMessages++;
            }
            if(item.type==="user_event")
                comboList.push(<UserEvent event={x} key={"ue"+x.id}/>);
        }
        let draftList = threadContents.drafts.map(x => <Draft draft={x} update={this.props.updateDraft} key={"d"+x.id}/>);

        let AssignmentsModal = (<ThreadAssignmentsModal
            isOpen={this.state.showAssignmentsModal}
            close={this.handleCloseAssignmentsModal}
            fetch={this.props.fetchThreadAssignments}
            updateAssignments={(data)=>{this.props.updateThreadAssignments(threadId,data)}}
            thread={thread}/>);

        return (
            <div className="col right">
                <div className="col-bottom" style={{padding: '20px'}}>
                    {mobileBackLink}
                    {this.props.threadId ? null : 'no threaad selected'}
                    {readOnly ? <i>NOTE: you have read-only permissions for this inbox</i> : null}

                    {AssignmentsModal}
                    <div className="threadview-header">
                        <div>
                            <div className="threadview-subject">{threadContents.snippet.subject}</div>
                            <div className="threadview-sender">{threadContents.snippet.from}</div>
                        </div>
                        <div className="pullRight">
                            <button className="btn-primary" disabled={true}>Notes</button>
                            <button className="btn-primary" onClick={this.handleOpenAssignmentsModal}>Assignments</button>
                        </div>
                    </div>

                    <hr/>
                    {comboList}
                    <div className="pullRight">
                        <button className="btn-primary" disabled={readOnly || numMessages === 0 || true } onClick={()=>{this.props.createDraft(threadId,'replyall')}}>Reply All</button>
                        <button className="btn-primary" disabled={readOnly || numMessages === 0} onClick={()=>{this.props.createDraft(threadId,'reply')}}>Reply</button>
                    </div>
                    <p>Drafts</p>
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
    fetchThreadAssignments: () => {
        dispatch(fetchThreadAssignments(ownProps.threadId));
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