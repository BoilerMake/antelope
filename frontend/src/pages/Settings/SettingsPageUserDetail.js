import React, { Component } from 'react';
import SettingsHeader from './SettingsHeader';

export class SettingsPageUserDetail extends Component {

    constructor (props) {
        super(props);
        this.state = {
            user: null
        }
    }
    componentDidMount() {
        this.props.fetchMe();
        this.props.fetchSettingsUser(this.props.match.params.userId);
        this.seedState(this.props);
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.match.params.userId !== this.props.match.params.userId)
            this.props.fetchSettingsUser(nextProps.match.params.userId);
        this.seedState(nextProps)
    }
    toggleAdmin() {
        this.setState({user: {...this.state.user, is_admin: !this.state.user.is_admin}});
    }
    seedState(props) {
        const userId = props.match.params.userId;
        let userDetail = props.settings.userDetail[userId];
        if (userDetail && userDetail.contents) {
            this.setState({user: userDetail.contents});
        }
    }
    saveUser() {
        this.props.putSetttingsUser(this.state.user);
    }
    render () {
        if(this.props.user.me && !this.props.user.me.is_admin)
            return(<SettingsHeader title="Users: Permission denied"/>);

        const user = this.state.user;
        if(!user) return(<SettingsHeader title="Loading..."/>);
        return(<div>
            <SettingsHeader title={`User Detail: ${user.first_name} ${user.last_name}`}/>
            <pre>{JSON.stringify(user,null,2)}</pre>
            <div> is admin? </div><input type="checkbox" checked={user.is_admin} onChange={this.toggleAdmin.bind(this)}/>
            <button className="btn-secondary" onClick={this.saveUser.bind(this)}>Save</button>
        </div>);
    }

}

//now the redux integration layer
import { connect } from 'react-redux'
function mapStateToProps (state) {
    return {
        user: state.user,
        settings: state.settings
    };
}

import { fetchMe } from '../../actions/users'
import { fetchSettingsUser, putSetttingsUser } from '../../actions/settings'
const mapDispatchToProps = (dispatch, ownProps) => ({
    fetchMe: () => {
        dispatch(fetchMe());
    },
    fetchSettingsUser: (id) => {
        dispatch(fetchSettingsUser(id));
    },
    putSetttingsUser: (user) => {
        dispatch(putSetttingsUser(user));
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(SettingsPageUserDetail);