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
        return(
            <div className={style} key={thread.id}>
                <div className="inbox-thread-list-item">
                    <strong>#{thread.id}:</strong> {thread.snippet.subject}
                    <br/>
                    {thread.snippet.sender}
                    <br/>
                    {date.fromNow()} // {date.calendar()}
                    <br/>
                </div>
            </div>);
    }
}

