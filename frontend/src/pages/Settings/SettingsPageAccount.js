import React, { Component } from 'react';
import SettingsHeader from './SettingsHeader';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import { convertToRaw, convertFromHTML, ContentState, EditorState } from 'draft-js';
export class SettingsPageAccount extends Component {

    constructor (props) {
        super(props);
        this.state = {
            me: {},
            editorState: null,
            markup: null,
        };
    }
    componentDidMount() {
        this.seedState(this.props);
        this.props.fetchMe();
    }
    componentWillReceiveProps(nextProps) {
        this.seedState(nextProps)
    }
    prefillWithHtml(html) {
        const blocksFromHTML = convertFromHTML(html);
        const content = ContentState.createFromBlockArray(blocksFromHTML);
        const editorState =  EditorState.createWithContent(content);
        const markup = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        this.setState({editorState,markup});
    }
    seedState(props) {
        if (!props.user.loading && props.user.me) {
            this.setState({me: props.user.me});
            this.prefillWithHtml(props.user.me.signature);
        }
    }
    textChange(prop,e) {
        this.setState({me: {
            ...this.state.me,
            [prop]: e.target.value,
        }});
    }
    onEditorStateChange(editorState) {
        const markup = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        this.setState({
            editorState,
            markup,
            me: {
                ...this.state.me,
                signature: markup
            }
        });
    }
    saveMe() {
        this.props.updateMe(this.state.me);
    }
    render () {
        return(<div style={{width: '500px'}}>
            <SettingsHeader title="Account Settings"/>
            <p>Hi, {this.state.me.displayName}</p>
            {/*<pre>{JSON.stringify(this.state.me,null,2)}</pre>*/}

            <div>
                <label>First Name</label>
                <input className="textInput_Dark" value={this.state.me.first_name} onChange={this.textChange.bind(this,"first_name")}/>
            </div>
            <div>
                <label>Last Name</label>
                <input className="textInput_Dark" value={this.state.me.last_name} onChange={this.textChange.bind(this,"last_name")}/>
            </div>
            <div>
                <label>email</label>
                <input className="textInput_Dark" value={this.state.me.email} onChange={this.textChange.bind(this,"email")}/>
            </div>
            signature
            <Editor
                editorState={this.state.editorState}
                onEditorStateChange={this.onEditorStateChange.bind(this)}
            />
            <button className="btn-primary" onClick={this.saveMe.bind(this)}>Save</button>
        </div>);
    }
}

//now the redux integration layer
import { connect } from 'react-redux'
function mapStateToProps (state) {
    return {
        user: state.user
    };
}

import { fetchMe, updateMe } from '../../actions/users'
const mapDispatchToProps = (dispatch, ownProps) => ({
    fetchMe: () => {
        dispatch(fetchMe());
    },
    updateMe: (data) => {
        dispatch(updateMe(data));
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(SettingsPageAccount);