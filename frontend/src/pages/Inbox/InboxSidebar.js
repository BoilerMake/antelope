import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
class InboxSidebar extends Component {
    componentDidMount() {
        this.props.fetchUserInboxList();
    }
    render () {
        let inboxList = this.props.user.inbox_list.map((inbox) =>
            <div className={parseInt(this.props.match.params.inboxId,10)===inbox.id ? 'sidebar-item-wrapper active-item' : 'sidebar-item-wrapper'}
                 key={inbox.id}
                 onClick={()=>{this.props.history.push(`/inbox/${inbox.id}`)}}>
                <div className="sidebar-item">
                    <div>{inbox.name}</div>
                </div>
            </div>);
        return (
            <div className="col left">
                <div className="col-top-left-brand">
                    Antelope
                    {this.props.isMobile &&  <div onClick={this.props.toggleSidebar}>[hide sidebar]</div>}
                </div>
                <div className="col-bottom sidebar-wrapper" >
                    <div id="sidebar-upper">
                        {inboxList}
                    </div>
                    <div id="sidebar-lower">
                        <div className="sidebar-item-wrapper"
                             style={{"borderTop":"1px solid white"}}
                             onClick={()=>this.props.history.push('/settings')}>
                            <div className="sidebar-item">
                                <div>settings [todo]</div>
                            </div>
                        </div>
                        <div className="sidebar-item-wrapper" onClick={()=>this.props.logout()}>
                            <div className="sidebar-item">
                                <div>logout</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

//now the redux integration layer
import { connect } from 'react-redux'
import { fetchUserInboxList, logoutUser } from '../../actions/users';
function mapStateToProps (state) {
    return {
        user: state.user
    };
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        fetchUserInboxList: () => { dispatch(fetchUserInboxList())},
        logout: () => { dispatch(logoutUser())}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(InboxSidebar));