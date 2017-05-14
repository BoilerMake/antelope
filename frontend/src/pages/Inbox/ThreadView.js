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
        let threadId = this.props.threadId;
        if(threadId===null){
            return (
                <div className="col right">
                    <div className="col-bottom">
                        {this.props.isMobile && <Link to={`/inbox/${this.props.inboxId}`}>back to inbox</Link>}
                        no thread selected
                    </div>
                </div>
            );
        }
        if(this.props.thread[threadId]===undefined || this.props.thread[threadId].contents === undefined)
            return (
                <div className="col right">
                    <div className="col-bottom">
                        {this.props.isMobile && <Link to={`/inbox/${this.props.inboxId}`}>back to inbox</Link>}
                        <h2>loading!</h2>
                    </div>
                </div>
            );
        let threadContents = this.props.thread[threadId].contents;
        console.log(threadContents);

        let messageList = threadContents.messages.map(message => {
            return(
                <MessageItem message={message} key={message.id}/>
            )
        })

        return (
            <div className="col right">
                <div className="col-bottom" style={{padding: '5px'}}>
                    {this.props.isMobile && <Link to={`/inbox/${this.props.inboxId}`}>back to inbox</Link>}
                    <h1>{threadContents.snippet.subject}{this.props.threadId}</h1>
                    <pre style={{width: '80%', "whiteSpace":"pre-wrap"}}>
                        {/*{JSON.stringify(this.props.user.me,null, 2)}*/}
                        {/*{JSON.stringify(threadContents,null, 2)}*/}
                    </pre>
                    {this.props.threadId ? `Viewing thread ${this.props.threadId}` : 'no threaad selected'}

                    eep
                    {messageList}

                    <h3>hi</h3>
                    <div style={{width: '50%', backgroundColor: 'blue'}}>hi</div>
                    <div style={{width: '100%', backgroundColor: 'red'}}>hi</div>
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