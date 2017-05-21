import React, { Component } from 'react';
import SettingsView from './SettingsView';
import SettingsSidebar from './SettingsSidebar';
class Inbox extends Component {
    render () {
        if(this.props.isMobile) {
            const sidebar = <SettingsSidebar isMobile toggleSidebar={this.props.toggleSidebar}/>;
            const body = (<SettingsView isMobile toggleSidebar={this.props.toggleSidebar}/>);
            return (
                <div className="f">
                    {this.props.sidebar ? sidebar : body}
                </div>
            );
        }
        else {
            //desktop layout
            return (
                <div className="f">
                    <SettingsSidebar/>
                    <SettingsView/>
                </div>
            );
        }
    }
}
// export default Inbox;
// now the redux integration layer
import { toggleSidebar } from '../../actions/system'
import { connect } from 'react-redux'
function mapStateToProps (state) {
    return {
        sidebar: state.system.sidebar,
        isMobile: state.system.layout === "mobile"
    };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    toggleSidebar: () => {
        dispatch(toggleSidebar());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Inbox);