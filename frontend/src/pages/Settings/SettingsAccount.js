import React, { Component } from 'react';
import SettingsHeader from './SettingsHeader';
export class SettingsAccount extends Component {

    componentDidMount() {
        this.props.fetchMe();
    }
    render () {
        return(<div>
            <SettingsHeader title="Account Settings"/>hiiii
            <pre>{JSON.stringify(this.props.user.me,null,2)}</pre>
        </div>);
    }
}

//now the redux integration layer
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
export default connect(mapStateToProps, mapDispatchToProps)(SettingsAccount);