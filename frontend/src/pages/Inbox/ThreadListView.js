import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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
        if(this.props.inbox[inboxId]===undefined || this.props.inbox[inboxId].contents === undefined)
            return (<h1>loading</h1>);
        let inboxContents = this.props.inbox[inboxId].contents;
        console.log(inboxContents);


        let threadList = inboxContents.threads.map((thread)=>{
            if(!thread.snippet) {
                return(
                    <div className="inbox-thread-list-item-wrapper" key={thread.id}>
                        <div className="inbox-thread-list-item">aaa</div>
                    </div>);
            }
            return(
                <div className="inbox-thread-list-item-wrapper" key={thread.id}>
                    <div className="inbox-thread-list-item">
                        {thread.snippet.sender}
                        <br/>
                        <Link to={`/inbox/${inboxId}/${thread.id}`}>view thread #{thread.id}</Link>
                    </div>
                </div>);
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

export default connect(mapStateToProps, mapDispatchToProps)(ThreadListView);