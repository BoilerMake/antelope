import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ThreadItem from './ThreadItem';
class ThreadListView extends Component {
    componentDidMount() {
        this.props.fetchInbox(this.props.inboxId);
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.inboxId !== this.props.inboxId)
            this.props.fetchInbox(nextProps.inboxId);
    }
    render () {
        let inboxId = this.props.inboxId;
        let inboxItem = this.props.inbox[inboxId];
        if(inboxItem===undefined || (inboxItem.contents === undefined && !inboxItem.isError))
            return (<div className="col center">
                <div className="col-top-right">
                    <div className="inboxlist-header-label">Inbox: loading...</div>
                    <br/>
                    <div>{this.props.isMobile &&  <div onClick={this.props.toggleSidebar}>toggle sidebar</div>}</div>
                </div>
            </div>);
        if(inboxItem.isError)
            return (<div className="col center">
                <div className="col-top-right">
                    <div className="inboxlist-header-label">Error... {inboxItem.error_message}</div>
                    <br/>
                    <div>{this.props.isMobile &&  <div onClick={this.props.toggleSidebar}>toggle sidebar</div>}</div>
                </div>
            </div>);
        let inboxContents = inboxItem.contents;


        let threadList = inboxContents.threads.map((thread)=>{
            if(!thread.snippet) return(null);
            return(
                <div onClick={()=>{this.props.history.push(`/inbox/${this.props.inboxId}/${thread.id}`)}} key={thread.id}>
                    <ThreadItem thread={thread} inboxId={inboxId} active={parseInt(this.props.threadId,10)===thread.id}/>
                </div>)
        });

        return (
            <div className="col center">
                <div className="col-top-right">
                    <div className="inboxlist-header-leftcol">
                        <div className="inboxlist-header-row">
                            <div className="inboxlist-header-label">Inbox:</div>
                            <div className="inboxlist-header-name">{inboxContents.name}</div>
                        </div>
                        <div className="inboxlist-header-row">
                            <input className="textInput" type="text" name="search" placeholder="search..."/>
                        </div>

                    </div>
                    <div className="inboxlist-header-rightcol">
                        <div>{this.props.isMobile &&  <a onClick={this.props.toggleSidebar}>[toggle sidebar]</a>}</div>
                        <div>hi</div>
                        <div className="inboxlist-header-row">
                            <div className="state-icon new"/>
                            <div>23</div>
                        </div>
                        <div className="inboxlist-header-row">
                            <div className="state-icon assigned"/>
                            <div>4</div>
                        </div>
                        <div className="inboxlist-header-row">
                            <div className="state-icon in-progress"/>
                            <div>9</div>
                        </div>
                        <div className="inboxlist-header-row">
                            <div className="state-icon done"/>
                            <div>591</div>
                        </div>
                    </div>
                    </div>
                <div className="col-bottom">
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