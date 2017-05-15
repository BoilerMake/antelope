import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MessageItem from './MessageItem';
class ThreadView extends Component {
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
        })

        return (
            <div className="col right">
                <div className="col-bottom" style={{padding: '20px'}}>
                    {this.props.isMobile && <Link to={`/inbox/${this.props.inboxId}`}>back to inbox</Link>}
                    {this.props.threadId ? null : 'no threaad selected'}

                    <div className="threadview-subject">{threadContents.snippet.subject}</div>
                    <div className="threadview-sender">{threadContents.snippet.from}</div>
                    <hr/>
                    {messageList}
                    <div style={{width: '50%', backgroundColor: 'grey'}}>50% width</div>
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