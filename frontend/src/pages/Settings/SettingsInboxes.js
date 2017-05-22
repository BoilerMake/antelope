import React, { Component } from 'react';
import SettingsHeader from './SettingsHeader';
export class SettingsInboxes extends Component {
    constructor (props) {
        super(props);
        this.state = {
            inboxes: [],
        };
    }
    componentDidMount() {
        this.seedState(this.props);
        this.props.fetchMe();
        this.props.fetchSettingsInboxes();
    }
    componentWillReceiveProps(nextProps) {
        this.seedState(nextProps)
    }
    seedState(props) {
        if(!props.settings.inboxes_loading)
            this.setState({inboxes: props.settings.inboxes});
    }
    handleInboxChange(index, propName, event) {
        let stateCopy = Object.assign({}, this.state);
        stateCopy.inboxes = stateCopy.inboxes.slice();
        stateCopy.inboxes[index] = Object.assign({}, stateCopy.inboxes[index]);
        stateCopy.inboxes[index][propName] = event.target.value;
        this.setState(stateCopy);
    }
    addInbox() {
        let stateCopy = Object.assign({}, this.state);
        stateCopy.inboxes = stateCopy.inboxes.slice();
        stateCopy.inboxes.push({
            id: null,
            name: "new inbox",
            regex: "regex",
            primary_address: "a"
        });
        this.setState(stateCopy);
    }
    saveInboxes() {
        console.log('hji');
        this.props.putSettingsInboxes(this.state.inboxes);
    }
    render () {
        if(this.props.user.me && !this.props.user.me.is_admin)
            return(<SettingsHeader title="Inbox Settings: Permission denied"/>);
        const isLoading = this.props.settings.inboxes_loading;
        let inboxList = this.state.inboxes.map((inbox,idx)=>{
            return(<tr key={idx}>
                <td>#{inbox.id}</td>
                <td><input className="textInput_Dark" type="text" onChange={this.handleInboxChange.bind(this, idx, "name")} value={inbox.name}/></td>
                <td><input className="textInput_Dark" type="text" onChange={this.handleInboxChange.bind(this, idx, "regex")} value={inbox.regex}/></td>
                <td><input className="textInput_Dark" type="text" onChange={this.handleInboxChange.bind(this, idx, "primary_address")} value={inbox.primary_address}/></td>
                <td>{inbox.is_default? 'yes' : 'no'}</td>
            </tr>);
        });
        return(<div>
            <SettingsHeader title="Inboxes"/>
            <table style={{width: "100%"}}>
                <thead style={{textAlign: "left", fontWeight: 700}}>
                    <tr>
                        <th>num</th>
                        <th>name</th>
                        <th>regex</th>
                        <th>primary address</th>
                        <th>default</th>
                    </tr>
                </thead>
                <tbody>
                    {inboxList}
                </tbody>
            </table>
            <div className="pullRight">
                <button className="btn-secondary" disabled={isLoading} onClick={this.saveInboxes.bind(this)}>Save</button>
                <button className="btn-secondary" disabled={isLoading} onClick={this.addInbox.bind(this)}>Create Inbox</button>
            </div>

            todo: show good errors on this page (like non-unique primary address, bad regex, etc
            todo: allow changing default
            {/*<pre>{JSON.stringify(this.props.inboxes,null,2)}</pre>*/}
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
import { fetchSettingsInboxes, putSettingsInboxes } from '../../actions/settings'
const mapDispatchToProps = (dispatch, ownProps) => ({
    fetchMe: () => {
        dispatch(fetchMe());
    },
    fetchSettingsInboxes: () => {
        dispatch(fetchSettingsInboxes());
    },
    putSettingsInboxes: (d) => {
        dispatch(putSettingsInboxes(d));
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(SettingsInboxes);