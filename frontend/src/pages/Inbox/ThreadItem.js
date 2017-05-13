import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment'
export default class ThreadItem extends Component {

    render () {
        let thread = this.props.thread;
        let date = moment.utc(thread.snippet.created_at,'YYYY-MM-DD HH:mm:ss').local();
        return(
            <div className="inbox-thread-list-item-wrapper" key={thread.id}>
                <div className="inbox-thread-list-item">
                    {thread.snippet.subject}
                    <br/>
                    {thread.snippet.sender}
                    <br/>
                    {date.fromNow()} // {date.calendar()}
                    <br/>
                    <Link to={`/inbox/${this.props.inboxId}/${thread.id}`}>view thread #{thread.id}</Link>
                </div>
            </div>);
    }
}

