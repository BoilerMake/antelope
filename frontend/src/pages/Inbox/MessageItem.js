import React, { Component } from 'react';
import moment from 'moment'
export default class MessageItem extends Component {

    render () {
        let date = moment.utc(this.props.message.created_at,'YYYY-MM-DD HH:mm:ss').local();
        return (
            <div style={{"border": "1px solid green"}}>
                {date.fromNow()} // {date.calendar()}
                <pre style={{width: '80%', "whiteSpace":"pre-wrap"}}>
                    {JSON.stringify(this.props,null, 2)}
                </pre>
            </div>
        );
    }
}

