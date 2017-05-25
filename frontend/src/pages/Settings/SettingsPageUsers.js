import React, { Component } from 'react';
import SettingsHeader from './SettingsHeader';
import {Table, Column, Cell} from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import {toastr} from 'react-redux-toastr'

export class SettingsPageUsers extends Component {

    constructor (props) {
        super(props);
        this.state = {
            newUserEmail: "",
        };
    }
    componentDidMount() {
        this.props.fetchMe();
        this.props.fetchUserList();
    }
    changeNewUserEmail(event) {
        this.setState({newUserEmail: event.target.value});
    }
    createNewUser() {
        this.props.createUser(this.state.newUserEmail);
        this.setState({newUserEmail: ""});
    }
    render () {
        if(this.props.user.me && !this.props.user.me.is_admin)
            return(<SettingsHeader title="Users: Permission denied"/>);
        const users = this.props.settings.userList;

        let table = (<div className="settingsTableWrap">
            <Table
                rowHeight={50}
                rowsCount={users.length}
                width={1200}
                height={800}
                headerHeight={50}>
                <Column
                    header={<Cell>ID</Cell>}
                    cell={({rowIndex, ...props}) => (
                        <Cell {...props}>
                            #{users[rowIndex]['id']}
                        </Cell>
                    )}
                    width={50}
                />
                <Column
                    header={<Cell>User</Cell>}
                    cell={({rowIndex, ...props}) => (
                        <Cell {...props}>
                            {users[rowIndex]['first_name']} {users[rowIndex]['last_name']}
                        </Cell>
                    )}
                    width={150}
                />
                <Column
                    header={<Cell>Email</Cell>}
                    cell={({rowIndex, ...props}) => (
                        <Cell {...props}>
                            {users[rowIndex]['email']}
                        </Cell>
                    )}
                    width={250}
                />
                <Column
                    header={<Cell>Group(s)</Cell>}
                    cell={({rowIndex, ...props}) => (
                        <Cell {...props}>
                            {users[rowIndex]['groups'].map(g=>g.name).join(", ")}
                        </Cell>
                    )}
                    width={250}
                />
                <Column
                    header={<Cell>Admin</Cell>}
                    cell={({rowIndex, ...props}) => (
                        <Cell {...props}>
                            {users[rowIndex]['is_admin'] ? 'yes' : 'no'}
                        </Cell>
                    )}
                    width={100}
                />
            </Table></div>);
        return(<div>
            <SettingsHeader title="Users"/>
            {table}
            <SettingsHeader title="Add a User"/>
            <div>
                <input className="textInput_Dark" placeholder="email" type="text" value={this.state.newUserEmail} onChange={this.changeNewUserEmail.bind(this)}/>
                <button className="btn-secondary" onClick={this.createNewUser.bind(this)}>Create User</button>
            </div>
            <button
                onClick={() => toastr.success('The title', 'The message')}
                type="button">Toastr Success</button>
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
import { fetchUserList, createUser } from '../../actions/settings'
const mapDispatchToProps = (dispatch, ownProps) => ({
    fetchMe: () => {
        dispatch(fetchMe());
    },
    fetchUserList: () => {
        dispatch(fetchUserList());
    },
    createUser: (email) => {
        dispatch(createUser(email));
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(SettingsPageUsers);