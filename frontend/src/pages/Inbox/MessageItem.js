import React, { Component } from 'react';
import moment from 'moment'
export default class MessageItem extends Component {

    render () {
        const { message } = this.props;
        const date = moment.utc(message.created_at,'YYYY-MM-DD HH:mm:ss').local();
        return (
            <div className="message-item">
                <div className="message-item-header">
                    <div className="message-item-header-left">{message.from}</div>
                    <div className="message-item-header-right">{date.calendar()}</div>
                </div>
                <hr/>
                <div className="message-item-body" dangerouslySetInnerHTML={{__html: message.body_html}} />
                {/*<pre style={{width: '80%', "whiteSpace":"pre-wrap"}}>*/}
                    {/*{JSON.stringify(message,null, 2)}*/}
                {/*</pre>*/}
            </div>
        );
    }
}

