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
            markup: null,
            isEditing: false
        };
        this.onEditorStateChange = this.onEditorStateChange.bind(this);
        this.toggleEditing = this.toggleEditing.bind(this);
        this.saveDraft = this.saveDraft.bind(this);
        this.sendDraft = this.sendDraft.bind(this);
    }
    onEditorStateChange(editorState) {
        const markup = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        this.setState({
            editorState,
            markup
        });
    }
    prefillWithHtml(html) {
        const blocksFromHTML = convertFromHTML(html);
        const content = ContentState.createFromBlockArray(blocksFromHTML);
        const editorState =  EditorState.createWithContent(content);
        const markup = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        this.setState({editorState,markup});
    }
    componentDidMount() {
        if(this.props.draft)
            this.prefillWithHtml(this.props.draft.body);
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.draft !== this.props.draft)
            this.prefillWithHtml(nextProps.draft.body);
    }
    toggleEditing() {
        this.setState({isEditing: !this.state.isEditing});
    }
    saveDraft() {
        let draft = this.props.draft;
        draft.body = this.state.markup;
        console.log(draft);
        this.props.update(draft,"save");
    }
    sendDraft() {
        let draft = this.props.draft;
        draft.body = this.state.markup;
        console.log(draft);
        this.props.update(draft,"send");
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
                <button className="btn-primary" onClick={this.saveDraft}>Save</button>
                <button className="btn-primary" onClick={this.toggleEditing}>Close</button>
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