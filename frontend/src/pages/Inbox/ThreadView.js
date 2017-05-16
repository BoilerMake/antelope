import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MessageItem from './MessageItem';
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
        const mobileBackLink = (this.props.isMobile && <Link to={`/inbox/${this.props.inboxId}`}>back to inbox</Link>);
        const threadId = this.props.threadId;
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
        if(this.props.thread[threadId]===undefined || this.props.thread[threadId].contents === undefined)
            return (
                <div className="col right">
                    <div className="col-bottom">
                        {mobileBackLink}
                        <h2>loading!</h2>
                    </div>
                </div>
            );
        let threadContents = this.props.thread[threadId].contents;
        let messageList = threadContents.messages.map(message => {
            return(
                <MessageItem message={message} key={message.id}/>
            )
        });

        let MessageModal = (<ThreadAssignmentsModal isOpen={this.state.showAssignmentsModal} close={this.handleCloseAssignmentsModal}/>);

        return (
            <div className="col right">
                <div className="col-bottom" style={{padding: '20px'}}>
                    {mobileBackLink}
                    {this.props.threadId ? null : 'no threaad selected'}

                    {MessageModal}
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
                        <button className="btn-primary">Reply All</button>
                        <button className="btn-primary">Reply</button>
                    </div>
                    {/*<div style={{width: '50%', backgroundColor: 'grey'}}>50% width</div>*/}
                </div>
            </div>
        );
    }
}

//now the redux integration layer
import { connect } from 'react-redux'
import { fetchThread } from '../../actions/thread'
function mapStateToProps (state) {
    return {
        user: state.user,
        thread: state.thread
    };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    fetchThread: (threadId) => {
        dispatch(fetchThread(threadId));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(ThreadView);