import React, { Component } from 'react';
import SettingsHeader from './SettingsHeader';
import {Table, Column, Cell} from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import moment from 'moment';
export class SettingsPageUsers extends Component {

    componentDidMount() {
        this.props.fetchMe();
        this.props.fetchUserList();
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
import { fetchUserList } from '../../actions/settings'
const mapDispatchToProps = (dispatch, ownProps) => ({
    fetchMe: () => {
        dispatch(fetchMe());
    },
    fetchUserList: () => {
        dispatch(fetchUserList());
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(SettingsPageUsers);