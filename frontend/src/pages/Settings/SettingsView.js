import React, { Component } from 'react';
import { withRouter, Route,  Redirect } from 'react-router-dom';
import SettingsPageAccount from './SettingsPageAccount';
import SettingsPageInboxes from './SettingsPageInboxes';
import SettingsPageUserEvents from './SettingsPageUserEvents';
import SettingsPageGroups from './SettingsPageGroups';
import SettingsPageGroupDetail from './SettingsPageGroupDetail';
import SettingsPageUsers from './SettingsPageUsers';
import SettingsPageUserDetail from './SettingsPageUserDetail';
class SettingsView extends Component {
    componentDidMount() {
        this.props.fetchMe();
    }
    render () {
        return (
            <div className="col right">
                <div className="col-bottom settingsWrapper" style={{padding: '50px 40px'}}>
                    <div>{this.props.isMobile &&  <a onClick={this.props.toggleSidebar}>[toggle sidebar]</a>}</div>
                    <Route exact path="/settings/" render={() => (<Redirect to="/settings/account"/>)}/>
                    <Route exact path="/settings/account" component={SettingsPageAccount}/>
                    <Route exact path="/settings/inboxes" component={SettingsPageInboxes}/>
                    <Route exact path="/settings/userevents" component={SettingsPageUserEvents}/>
                    <Route exact path="/settings/groups" component={SettingsPageGroups}/>
                    <Route exact path="/settings/groups/:groupId" component={SettingsPageGroupDetail}/>
                    <Route exact path="/settings/users" component={SettingsPageUsers}/>
                    <Route exact path="/settings/users/:userId" component={SettingsPageUserDetail}/>
                </div>
            </div>
        );
    }
}

import { connect } from 'react-redux'
function mapStateToProps (state) {
    return {
        user: state.user
    };
}

import { fetchMe } from '../../actions/users'
const mapDispatchToProps = (dispatch, ownProps) => ({
    fetchMe: () => {
        dispatch(fetchMe());
    }
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SettingsView));