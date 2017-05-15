import React, { Component } from 'react';
import moment from 'moment'
export default class ThreadItem extends Component {
    render () {
        let thread = this.props.thread;
        let date = moment.utc(thread.snippet.created_at,'YYYY-MM-DD HH:mm:ss').local();
        let style = "inbox-thread-list-item-wrapper";
        if(this.props.unread)
            style = "inbox-thread-list-item-wrapper unread";
        if(this.props.active)
            style = "inbox-thread-list-item-wrapper active";
        let threadUsers = thread.users.map(u=>u.displayName).join(", ");
        return(
            <div className={style} key={thread.id}>
                <div className="inbox-thread-list-item">
                    <div className="threaditem-leftcol">
                        <div className={`state-icon ${thread.state}`}/>
                    </div>
                    <div className="threaditem-rightcol">
                        <div className="threaditem-row">
                            <div className="threaditem-rowitem-left sender">{thread.snippet.from}</div>
                            <div className="threaditem-rowitem-right time">{date.calendar()}</div>
                        </div>
                        <div className="threaditem-row">
                            <div className="threaditem-rowitem-left subject">{thread.snippet.subject}</div>
                            <div className="threaditem-rowitem-right assign">{threadUsers}</div>
                        </div>
                        <div className="threaditem-row">
                            <div className="threaditem-rowitem-left body">{thread.snippet.body_plain}</div>
                        </div>
                    </div>

                    <br/>
                </div>
            </div>);
    }
}

