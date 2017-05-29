import React, { Component } from 'react';
import SettingsHeader from './SettingsHeader';

export class SettingsPageGroupDetail extends Component {

    constructor (props) {
        super(props);
        this.state = {
            group: null
        }
    }
    componentDidMount() {
        this.props.loadData();
        this.seedState(this.props);
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.match.params.groupId !== this.props.match.params.groupId)
            this.props.fetchSettingsGroup(nextProps.match.params.groupId);
        this.seedState(nextProps)
    }
    seedState(props) {
        const groupId = props.match.params.groupId;
        let groupDetail = props.settings.groupDetail[groupId];
        if (groupDetail && groupDetail.contents) {
            this.setState({group: groupDetail.contents});
        }
    }
    saveGroup() {
        this.props.putSetttingsGroup(this.state.group);
    }
    render () {
        if(this.props.user.me && !this.props.user.me.is_admin)
            return(<SettingsHeader title="Groups: Permission denied"/>);

        const group = this.state.group;
        if(!group) return(<SettingsHeader title="Loading..."/>);

        const membersTableBody = this.state.group.users.map(u=><tr key={`u1-${u.id}`}>
            <td>{u.id}</td>
            <td>{u.displayName}</td>
            <td><button className="btn-secondary" onClick={this.props.removeUserFromGroup.bind(this,u.id)}>Remove</button></td>
        </tr>);
        const memberIds = this.state.group.users.map(u=>u.id);


        const nonMembersTableBody = this.props.settings.userList.map(u=><tr key={`u2-${u.id}`}>
            <td>{u.id}</td>
            <td>{u.displayName}</td>
            <td><button className="btn-secondary" disabled={memberIds.includes(u.id)} onClick={this.props.addUserToGroup.bind(this,u.id)}>Add to Group</button></td>
        </tr>);

        return(<div>
            <SettingsHeader title={`Group Detail: ${group.name}`}/>
            <p>Members</p>
            <table className="settingsPageTable">
                <tbody>{membersTableBody}</tbody>
            </table>
            <p>non Members</p>
            <table className="settingsPageTable">
                <tbody>{nonMembersTableBody}</tbody>
            </table>
            {/*<pre>{JSON.stringify(group,null,2)}</pre>*/}
            <button className="btn-secondary" onClick={this.saveGroup.bind(this)}>Save</button>
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
import { fetchSettingsGroup, putSetttingsGroup, changeGroupUserMembership, fetchUserList } from '../../actions/settings'
const mapDispatchToProps = (dispatch, ownProps) => ({
    loadData: () => {
        dispatch(fetchUserList());
        dispatch(fetchMe());
        dispatch(fetchSettingsGroup(ownProps.match.params.groupId));
    },
    putSetttingsGroup: (group) => {
        dispatch(putSetttingsGroup(group));
    },
    addUserToGroup: (userId) => {
        dispatch(changeGroupUserMembership(ownProps.match.params.groupId, userId, "add"));
    },
    removeUserFromGroup: (userId) => {
        dispatch(changeGroupUserMembership(ownProps.match.params.groupId, userId, "remove"));
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(SettingsPageGroupDetail);