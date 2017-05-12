import React, { Component } from 'react';
export default class MessageItem extends Component {

    render () {
        return (
            <div>
                <pre style={{width: '80%', "whiteSpace":"pre-wrap", "border": "1px solid green"}}>
                        message
                    <br/>
                        {JSON.stringify(this.props,null, 2)}
                    </pre>
            </div>
        );
    }
}

