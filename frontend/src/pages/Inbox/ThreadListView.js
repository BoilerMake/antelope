import React, { Component } from 'react';
import { findDOMNode} from 'react-dom';
import { withRouter } from 'react-router-dom';
import ThreadItem from './ThreadItem';
class ThreadListView extends Component {
    constructor () {
        super();
        this.state = {
            searchQuery: "",
        };
    }
    componentDidMount() {
        this.props.fetchInbox(this.props.inboxId, this.state.searchQuery);
        this.ensureActiveItemVisible();
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.inboxId !== this.props.inboxId)
            this.props.fetchInbox(nextProps.inboxId, this.state.searchQuery);
    }
    componentDidUpdate(prevProps) {
        // only scroll into view if the active item changed last render
        if ((this.props.threadId !== prevProps.threadId) || this.props.inbox !== prevProps.inbox)
            this.ensureActiveItemVisible();
    }
    ensureActiveItemVisible() {
        const itemComponent = this.refs.activeItem;
        if (itemComponent) findDOMNode(itemComponent).scrollIntoView();
    }
    searchQueryChange(event) {
        this.setState({searchQuery: event.target.value});
        this.props.fetchInbox(this.props.inboxId, this.state.searchQuery);
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
            const isActive = parseInt(this.props.threadId,10)===thread.id;
            return(
                <ThreadItem
                    thread  = {thread}
                    meId    = {this.props.user.me ? this.props.user.me.id : 0}
                    inboxId = {parseInt(inboxId,10)}
                    ref     = {isActive ? "activeItem" : null}
                    active  = {isActive}
                    key     = {thread.id}
                    onClick = {()=>{this.props.history.push(`/inbox/${this.props.inboxId}/${thread.id}`)}}
                />
            );
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
                            <input className="textInput" type="text" name="search" placeholder="search..." value={this.state.searchQuery} onChange={this.searchQueryChange.bind(this)}/>
                        </div>
                        {parseInt(inboxId,10) !== 0 && (<button className="btn-primary" onClick={this.props.createThread}>Create Thread</button>)}
                        <i>{inboxContents.query ? `Showing messages containing string: ${inboxContents.query}` : null}</i>
                    </div>
                    <div className="inboxlist-header-rightcol">
                        <div>{this.props.isMobile &&  <a onClick={this.props.toggleSidebar}>[toggle sidebar]</a>}</div>
                        <div className="inboxlist-header-row">
                            <div className="state-icon new"/>
                            <div style={{paddingTop: '1px'}}>{inboxItem.contents.counts.new}</div>
                        </div>
                        <div className="inboxlist-header-row">
                            <div className="state-icon assigned"/>
                            <div style={{paddingTop: '1px'}}>{inboxItem.contents.counts.assigned}</div>
                        </div>
                        <div className="inboxlist-header-row">
                            <div className="state-icon in-progress"/>
                            <div style={{paddingTop: '1px'}}>{inboxItem.contents.counts['in-progress']}</div>
                        </div>
                        <div className="inboxlist-header-row">
                            <div className="state-icon done"/>
                            <div style={{paddingTop: '1px'}}>{inboxItem.contents.counts.done}</div>
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
import { fetchInbox, createThread } from '../../actions/inbox';
function mapStateToProps (state) {
    return {
        user: state.user,
        inbox: state.inbox
    };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    fetchInbox: (inboxId, query) => {
        dispatch(fetchInbox(inboxId, query));
    },
    createThread: () => {
        dispatch(createThread(ownProps.inboxId));
    }
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ThreadListView));