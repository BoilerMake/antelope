import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SettingsHeader from './SettingsHeader';
import {Table, Column, Cell} from 'fixed-data-table-2';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import moment from 'moment';
export class SettingsPageUserEvents extends Component {

    componentDidMount() {
        this.props.fetchMe();
        this.props.fetchSettingsUserEvents();
    }
    render () {
        if(this.props.user.me && !this.props.user.me.is_admin)
            return(<SettingsHeader title="User Events: Permission denied"/>);
        const events = this.props.settings.user_events;
        let table = (<div className="settingsTableWrap">
            <Table
                rowHeight={50}
                rowsCount={events.length}
                width={1200}
                height={800}
                headerHeight={50}>
                <Column
                    header={<Cell>ID</Cell>}
                    cell={({rowIndex, ...props}) => (
                        <Cell {...props}>
                            #{events[rowIndex]['id']}
                        </Cell>
                    )}
                    width={50}
                />
                <Column
                    header={<Cell>User</Cell>}
                    cell={({rowIndex, ...props}) => (
                        <Cell {...props}>
                            <Link to={`/settings/users/${events[rowIndex]['user']['id']}`}>
                                {events[rowIndex]['user']['displayName']} (#{events[rowIndex]['user']['id']})
                            </Link>
                        </Cell>

                    )}
                    width={150}
                />
                <Column
                    header={<Cell>Action</Cell>}
                    cell={({rowIndex, ...props}) => (
                        <Cell {...props}>
                            {events[rowIndex]['type']}
                        </Cell>
                    )}
                    width={150}
                />
                <Column
                    header={<Cell>Inbox</Cell>}
                    cell={({rowIndex, ...props}) => (
                        <Cell {...props}>
                            {events[rowIndex]['inbox'] ? `${events[rowIndex]['inbox']['name']} (#${events[rowIndex]['inbox']['id']})` : "n/a"}
                        </Cell>
                    )}
                    width={150}
                />
                <Column
                    header={<Cell>Thread</Cell>}
                    cell={({rowIndex, ...props}) => (
                        <Cell {...props}>
                            {events[rowIndex]['thread'] ? `${events[rowIndex]['thread']['id']}` : "n/a"}
                        </Cell>
                    )}
                    width={150}
                />
                <Column
                    header={<Cell>Message</Cell>}
                    cell={({rowIndex, ...props}) => (
                        <Cell {...props}>
                            {events[rowIndex]['message'] ? `${events[rowIndex]['message']['id']}` : "n/a"}
                        </Cell>
                    )}
                    width={150}
                />
                <Column
                    header={<Cell>Target User</Cell>}
                    cell={({rowIndex, ...props}) => (
                        <Cell {...props}>
                            {events[rowIndex]['target']
                                ? <Link to={`/settings/users/${events[rowIndex]['target']['id']}`}>{`${events[rowIndex]['target']['displayName']} (${events[rowIndex]['target']['id']})`}</Link>
                                : "n/a"}
                        </Cell>
                    )}
                    width={150}
                />
                <Column
                    header={<Cell>Time</Cell>}
                    cell={({rowIndex, ...props}) => (
                        <Cell {...props}>
                            {moment.utc(events[rowIndex]['created_at'],'YYYY-MM-DD HH:mm:ss').local().calendar()}
                        </Cell>
                    )}
                    width={250}
                />
            </Table></div>);
        return(<div>
            <SettingsHeader title="User Events"/>
            {table}
            {/*<pre>{JSON.stringify(this.props.settings.user_events,null,2)}</pre>*/}
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
import { fetchSettingsUserEvents } from '../../actions/settings'
const mapDispatchToProps = (dispatch, ownProps) => ({
    fetchMe: () => {
        dispatch(fetchMe());
    },
    fetchSettingsUserEvents: () => {
        dispatch(fetchSettingsUserEvents());
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(SettingsPageUserEvents);