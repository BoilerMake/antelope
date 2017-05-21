import React, { Component } from 'react';
import SettingsHeader from './SettingsHeader';
export class SettingsAccount extends Component {
    constructor (props) {
        super(props);
        this.state = {
            inboxes: [],
        };
    }
    componentDidMount() {
        this.props.fetchMe();
        this.props.fetchSettingsInboxes();
    }
    render () {
        if(this.props.user.me && !this.props.user.me.is_admin)
            return(<SettingsHeader title="Inbox Settings: Permission denied"/>)
        return(<div>
            <SettingsHeader title="Inboxes"/>
            hi
            <pre>{JSON.stringify(this.props.inboxes,null,2)}</pre>
        </div>);
    }
}

//now the redux integration layer
import { connect } from 'react-redux'
function mapStateToProps (state) {
    return {
        user: state.user,
        inboxes: state.settings.inboxes
    };
}

import { fetchMe } from '../../actions/users'
import { fetchSettingsInboxes } from '../../actions/settings'
const mapDispatchToProps = (dispatch, ownProps) => ({
    fetchMe: () => {
        dispatch(fetchMe());
    },
    fetchSettingsInboxes: () => {
        dispatch(fetchSettingsInboxes());
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(SettingsAccount);