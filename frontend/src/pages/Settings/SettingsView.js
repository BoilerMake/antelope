import React, { Component } from 'react';
import { withRouter, Route,  Redirect } from 'react-router-dom';
import SettingsAccount from './SettingsAccount';
import SettingsInboxes from './SettingsInboxes';
import SettingsPageUserEvents from './SettingsPageUserEvents';
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
                    <Route exact path="/settings/account" component={SettingsAccount}/>
                    <Route exact path="/settings/inboxes" component={SettingsInboxes}/>
                    <Route exact path="/settings/userevents" component={SettingsPageUserEvents}/>
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