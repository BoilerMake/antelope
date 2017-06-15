import React, { Component } from 'react';
import { DEV_MODE }  from '../../config';
import moment from 'moment'
export default class MessageItem extends Component {

    render () {
        const { message } = this.props;
        const date = moment.utc(message.created_at,'YYYY-MM-DD HH:mm:ss').local();
        return (
            <div className="message-item">
                <div className="message-item-header">
                    <div className="message-item-header-left">{message.from}</div>
                    <div className="message-item-header-right">{date.format("ddd, MMMM Do YYYY, h:mm:ss a")}</div>
                </div>
                <hr/>
                    <div className="message-item-body" dangerouslySetInnerHTML={{__html: message.body_html}}/>
                {DEV_MODE ?
                    <pre style={{width: '90%', "whiteSpace": "pre-wrap", backgroundColor: 'grey'}}>
                        debug data<br/>
                        {JSON.stringify(message, null, 2)}
                    </pre> : null}
            </div>
        );
    }
}

