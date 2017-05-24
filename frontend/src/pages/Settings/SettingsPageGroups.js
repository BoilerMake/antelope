import React, { Component } from 'react';
import SettingsHeader from './SettingsHeader';
export class SettingsPageGroups extends Component {

    constructor (props) {
        super(props);
        this.state = {
            matrix: {},
            showCreateGroup: false,
            newGroupName: "",
        };
    }
    componentDidMount() {
        this.seedState(this.props);
        this.props.fetchMe();
        this.props.loadData();
    }
    componentWillReceiveProps(nextProps) {
        this.seedState(nextProps)
    }
    seedState(props) {
        if (!props.settings.groupInboxMatrix_loading)
            this.setState({matrix: props.settings.groupInboxMatrix});
    }
    selectChange(groupId,inboxId,e) {
        this.setState({matrix: {
            ...this.state.matrix,
            [groupId]: {
                ...this.state.matrix[groupId],
                permissions: {
                    ...this.state.matrix[groupId]['permissions'],
                    [inboxId]: e.target.value
                }
            }
        }});
    }
    saveMatrix() {
        this.props.putSettingsGroupInboxMatrix(this.state.matrix);
    }
    toggleCreateGroup() {
        this.setState({showCreateGroup: !this.state.showCreateGroup});
    }
    changeNewGroupName(event) {
        this.setState({newGroupName: event.target.value});
    }
    createNewGroup() {
        this.props.createGroup(this.state.newGroupName);
        this.setState({newGroupName: ""});
        this.toggleCreateGroup();
    }

    render () {

        const PermissionSelector = ({name,value,handleChange}) => (

            <select name={name} value={value} onChange={handleChange} className="selectInput">
                <option value="readwrite">Read & Write</option>
                <option value="read">Read Only</option>
                <option value="none">None</option>
            </select>);

        if(this.props.user.me && !this.props.user.me.is_admin)
            return(<SettingsHeader title="Groups: Permission denied"/>);
        const matrix = this.state.matrix;

        let tableHead = this.props.settings.inboxes.map(i=><td key={`h-${i.id}`}>{i.name}</td>);

        let tableBody = Object.keys(matrix).map(groupId=>{
            let eachRow = Object.keys(matrix[groupId]['permissions']).map(inboxId=>
                <td key={`td-${groupId}-${inboxId}`}>
                    <PermissionSelector value={matrix[groupId]['permissions'][inboxId]} handleChange={this.selectChange.bind(this,groupId,inboxId)} />
                </td>);
            eachRow.unshift(<td key={`td-${groupId}`} className="settingsPageGroups-LeftTable">{matrix[groupId]['name']}</td>);
            return <tr key={`tr-${groupId}`}>{eachRow}</tr>;
        });

        let createGroup = (<div>
            <input className="textInput_Dark" type="text" value={this.state.newGroupName} onChange={this.changeNewGroupName.bind(this)}/>
            <br/>
            <button className="btn-secondary" onClick={this.createNewGroup.bind(this)}>Create</button>
        </div>);
        return(<div>
            <SettingsHeader title="Groups"/>
            <p>Here's a matrix outlining each group's inbox permissions</p>
            <table className="settingsPageGroupsTable">
                <thead>
                    <tr><td key="1" rowSpan="2" className="settingsPageGroups-LeftTable"><b>Group</b></td><td style={{textAlign: "center"}} colSpan={this.props.settings.inboxes.length}>Inbox Name</td></tr>
                    <tr>{tableHead}</tr>
                </thead>
                <tbody>
                {tableBody}
                </tbody>
            </table>
            <br/>
            <button className="btn-primary" onClick={this.saveMatrix.bind(this)}>Update Permissions</button>
            <button className="btn-secondary" onClick={this.toggleCreateGroup.bind(this)}>New Group</button>
            {this.state.showCreateGroup ? createGroup : null}
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
import { fetchSettingsGroupInboxMatrix, fetchSettingsInboxes, putSettingsGroupInboxMatrix, createGroup } from '../../actions/settings'
const mapDispatchToProps = (dispatch, ownProps) => ({
    fetchMe: () => {
        dispatch(fetchMe());
    },
    loadData: () => {
        dispatch(fetchSettingsGroupInboxMatrix());
        dispatch(fetchSettingsInboxes());
    },
    putSettingsGroupInboxMatrix: (matrix) => {
        dispatch(putSettingsGroupInboxMatrix(matrix));
    },
    createGroup: (name) => {
        dispatch(createGroup(name))
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(SettingsPageGroups);