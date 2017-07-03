import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import { convertToRaw, convertFromHTML, ContentState, EditorState } from 'draft-js';
export default class Draft extends Component {
    constructor () {
        super();
        this.state = {
            editorState: null,
            markup:      null,
            isEditing:   false,
            to:          "",
            subject:     "",
            cc:          "",
            bcc:         "",
            from:        "",
        };
        this.onEditorStateChange = this.onEditorStateChange.bind(this);
        this.toggleEditing       = this.toggleEditing.bind(this);
        this.saveDraft           = this.saveDraft.bind(this);
        this.sendDraft           = this.sendDraft.bind(this);
    }
    onEditorStateChange(editorState) {
        const markup = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        this.setState({
            editorState,
            markup
        });
    }
    seedState(draft) {

        let {to, subject, cc, bcc, from} = draft;
        //prefill with html:
        let blocksFromHTML = convertFromHTML(draft.body);
        let content = ContentState.createFromBlockArray(blocksFromHTML);
        let editorState =  EditorState.createWithContent(content);
        let markup = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        this.setState({editorState, markup, to, subject, cc, bcc, from});
    }
    componentDidMount() {
        if(this.props.draft)
            this.seedState(this.props.draft);
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.draft !== this.props.draft)
            this.seedState(nextProps.draft);
    }
    toggleEditing() {
        this.setState({isEditing: !this.state.isEditing});
    }
    saveDraft() {
        this.update("save");
    }
    sendDraft() {
        this.update("send");
    }
    update(action) {
        let draft     = this.props.draft;
        draft.body    = this.state.markup;
        draft.to      = this.state.to;
        draft.subject = this.state.subject;
        draft.cc      = this.state.cc;
        draft.bcc     = this.state.bcc;
        draft.from    = this.state.from;
        this.props.update(draft,action);
    }
    textChange(event) {
        this.setState({[event.target.name]: event.target.value})
    }
    render () {
        let editingView = (
            <div>
                <Editor
                editorState={this.state.editorState}
                onEditorStateChange={this.onEditorStateChange}
                toolbarClassName="draft-toolbar"
                wrapperClassName="draft-wrapper"
                editorClassName="draft-editor"
                />
                <div>
                    <p>from:</p>
                    <input disabled={true} className="textInput wideInput" type="email" name="from" placeholder="From" value={this.state.from} onChange={this.textChange.bind(this)}/>
                </div>
                <div>
                    <p>to:</p>
                    <input className="textInput wideInput" type="text" name="to" placeholder="To" value={this.state.to} onChange={this.textChange.bind(this)}/>
                </div>
                <div>
                    <p>cc:</p>
                    <input className="textInput wideInput" type="text" name="cc" placeholder="CC" value={this.state.cc} onChange={this.textChange.bind(this)}/>
                </div>
                <div>
                    <p>bcc:</p>
                    <input className="textInput wideInput" type="text" name="bcc" placeholder="BCC" value={this.state.bcc} onChange={this.textChange.bind(this)}/>
                </div>
                <div>
                    <p>subject:</p>
                    <input className="textInput wideInput" type="text" name="subject" placeholder="Subject" value={this.state.subject} onChange={this.textChange.bind(this)}/>
                </div>
                <hr/>
                <button className="btn-secondary" onClick={this.saveDraft}>Save</button>
                <button className="btn-secondary" onClick={this.toggleEditing}>Close</button>
                <button className="btn-primary" onClick={this.sendDraft}>Send</button>
        </div>);
        let displayView = (
            <div>
                <pre>{JSON.stringify(this.props.draft,null,2)}</pre>
                <button className="btn-primary" onClick={this.toggleEditing}>Edit</button>
            </div>);
        return (
            <div>
                { this.state.isEditing ? editingView : displayView}
            </div>
        );
    }
}