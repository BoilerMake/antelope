import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import logo from '../../assets/images/logo.png'
class SettingsSidebar extends Component {
    render () {
        const sidebarItems = [
            {name:'account', title: 'My Account'},
            {name:'inboxes', title: 'Inboxes'},
            {name:'userevents', title: 'User Events'},
            {name:'groups', title: 'Groups'},
            ];
        //todo: only show admin items (this.props.user.me.is_admin + filter())
        let inboxList = sidebarItems.map((item,index) =>
            <div className={this.props.match.params.category === item.name ? 'sidebar-item-wrapper active-item' : 'sidebar-item-wrapper'}
                 key={index}
                 onClick={()=>{this.props.history.push(`/settings/${item.name}`)}}>
                <div className="sidebar-item">
                    <div><div>{item.title}</div></div>
                </div>
            </div>);
        return (
            <div className="col left">
                <div className="col-top-left-brand">
                    <img src={logo} alt="logo" className="sidebar-logo" />
                    <div>Antelope</div>
                    {this.props.isMobile &&  <div onClick={this.props.toggleSidebar}>[hide sidebar]</div>}
                </div>
                <div className="col-bottom sidebar-wrapper">
                    <div id="sidebar-upper">
                        {inboxList}
                    </div>
                    <div id="sidebar-lower">
                        <div className="sidebar-item-wrapper bottomItem"
                             onClick={()=>this.props.history.push('/inbox')}>
                            <div className="sidebar-item">
                                <div>Back to inbox</div>
                            </div>
                        </div>
                        <div className="sidebar-item-wrapper bottomItem" onClick={()=>this.props.logout()}>
                            <div className="sidebar-item">
                                <div>Logout</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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