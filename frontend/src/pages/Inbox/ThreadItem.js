import React, { Component } from 'react';
import moment from 'moment'
import PropTypes from 'prop-types';
export default class ThreadItem extends Component {
    render () {
        let thread = this.props.thread;
        let snippet = thread.snippet;
        let date = moment.utc(snippet.created_at,'YYYY-MM-DD HH:mm:ss').local();
        console.log(date,snippet.created_at);
        let style = "inbox-thread-list-item-wrapper";
        if(this.props.unread)
            style = "inbox-thread-list-item-wrapper unread";
        if(this.props.active)
            style = "inbox-thread-list-item-wrapper active";
        let threadUsers = thread.users.map(u=>u.displayName).join(", ");
        const AmIAssigned = thread.users.map(u=>u.id).includes(this.props.meId);
        return(
            <div className={style} key={thread.id}>
                <div className="inbox-thread-list-item">
                    <div className="threaditem-leftcol">
                        <div className={`state-icon ${thread.state}`}/>
                        {AmIAssigned ? <div>*</div> : null}
                    </div>
                    <div className="threaditem-rightcol">
                        <div className="threaditem-row">
                            <div className="threaditem-rowitem-left sender">{snippet.from}</div>
                            <div className="threaditem-rowitem-right time">{date.calendar()}</div>
                        </div>
                        <div className="threaditem-row">
                            <div className="threaditem-rowitem-left subject">{snippet.subject}</div>
                            <div className="threaditem-rowitem-right assign">{threadUsers}</div>
                        </div>
                        <div className="threaditem-row">
                            <div className="threaditem-rowitem-left body">{snippet.body_plain}</div>
                        </div>
                    </div>

                    <br/>
                </div>
            </div>);
    }
}
ThreadItem.propTypes = {
    thread: PropTypes.object.isRequired,
    meId: PropTypes.number.isRequired,
    inboxId: PropTypes.number.isRequired,
    active: PropTypes.bool
};
