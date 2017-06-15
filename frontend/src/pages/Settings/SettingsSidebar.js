import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

class SettingsSidebar extends Component {
    render () {
        const sidebarItemsAdmin = [
            {name:'account', title: 'My Account'},
            {name:'inboxes', title: 'Inboxes'},
            {name:'users', title: 'Users'},
            {name:'userevents', title: 'User Events'},
            {name:'groups', title: 'Groups'},
            ];
        const sidebarItems = this.props.user.me && this.props.user.me.is_admin ? sidebarItemsAdmin : [{name: 'account', title: 'My Account'}];
        let sidebarItemList = sidebarItems.map((item,index) =>
            <div className={this.props.match.params.category === item.name ? 'sidebar-item-wrapper active-item' : 'sidebar-item-wrapper'}
                 key={index}
                 onClick={()=>{this.props.history.push(`/settings/${item.name}`)}}>
                <div className="sidebar-item">
                    <div><div>{item.title}</div></div>
                </div>
            </div>);
        let lowerSidebar = [
            (
                <div className="sidebar-item-wrapper bottomItem" onClick={()=>this.props.history.push('/inbox')}>
                    <div className="sidebar-item">
                        <div>Back to inbox</div>
                    </div>
                </div>
            ),
            (
                <div className="sidebar-item-wrapper bottomItem" onClick={()=>this.props.logout()}>
                    <div className="sidebar-item">
                        <div>Logout</div>
                    </div>
                </div>
            )
        ];
        return (
            <Sidebar upper={sidebarItemList} lower={lowerSidebar} isMobile={this.props.isMobile} toggleSidebar={this.props.toggleSidebar}/>
        );
    }
}

//now the redux integration layer
import { connect } from 'react-redux'
import { logoutUser } from '../../actions/users';
function mapStateToProps (state) {
    return {
        user: state.user
    };
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        logout: () => { dispatch(logoutUser())}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SettingsSidebar));