import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
class InboxSidebar extends Component {
    componentDidMount() {
        this.props.fetchUserInboxList();
    }
    render () {
        let inboxes = this.props.user.inbox_list;//[{id: 0, name: "all inboxes"},{id: 3, name: "inb3"},{id: 5, name: "inb5"}];
        let inboxList = inboxes.map((inbox) =>
            <div className={parseInt(this.props.match.params.inboxId,10)===inbox.id ? 'inbox-sidebar-item-wrapper active-item' : 'inbox-sidebar-item-wrapper'} key={inbox.id}>
                <div className="inbox-sidebar-item">
                    <Link className="sidebar-item-link" to={`/inbox/${inbox.id}`} style={{color: 'white'}}>{inbox.name}</Link>
                </div>
            </div>);
        return (
            <div className="inbox-column left">
                <div className="top-left">
                    Antelope
                    {this.props.isMobile &&  <button onClick={this.props.toggleSidebar}>aa</button>}
                </div>
                <div className="inbox-column-bottom" >
                    {inboxList}
                </div>
            </div>
        );
    }
}

//now the redux integration layer
import { connect } from 'react-redux'
import { fetchUserInboxList } from '../../actions/users';
function mapStateToProps (state) {
    return {
        user: state.user
    };
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        fetchUserInboxList: () => { dispatch(fetchUserInboxList())}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(InboxSidebar));