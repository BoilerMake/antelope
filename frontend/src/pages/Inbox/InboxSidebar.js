import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

class InboxSidebar extends Component {
    componentDidMount() {
        this.props.fetchUserInboxList();
    }
    render () {
        let inboxList = this.props.user.inbox_list.map((inbox) =>
            <div className={parseInt(this.props.match.params.inboxId,10)===inbox.id ? 'sidebar-item-wrapper active-item' : 'sidebar-item-wrapper'}
                 key={inbox.id}
                 onClick={()=>{this.props.history.push(`/inbox/${inbox.id}`)}}>
                <div className="sidebar-item">
                    <div><div>{inbox.name}</div></div>
                    <div className="sidebar-badge"><div>{inbox.countNew}</div></div>
                </div>
            </div>);
        let lowerSidebar = [
            (
                <div className="sidebar-item-wrapper bottomItem" key="settings" onClick={()=>this.props.history.push('/settings')}>
                    <div className="sidebar-item">
                        <div>Settings</div>
                    </div>
                </div>
            ),
            (
                <div className="sidebar-item-wrapper bottomItem" key="logout" onClick={()=>this.props.logout()}>
                    <div className="sidebar-item">
                        <div>Logout</div>
                    </div>
                </div>
            )
        ];
        return (
            <Sidebar upper={inboxList} lower={lowerSidebar} isMobile={this.props.isMobile} toggleSidebar={this.props.toggleSidebar}/>
        );
    }
}

//now the redux integration layer
import { connect } from 'react-redux'
import { fetchUserInboxList, logoutUser } from '../../actions/users';
function mapStateToProps (state) {
    return {
        user: state.user
    };
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        fetchUserInboxList: () => { dispatch(fetchUserInboxList())},
        logout: () => { dispatch(logoutUser())}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(InboxSidebar));