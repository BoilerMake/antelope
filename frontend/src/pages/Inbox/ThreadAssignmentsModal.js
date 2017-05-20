import React, { Component } from 'react';
import ReactModal from 'react-modal';

export default class ThreadAssignmentsModal extends Component {

    constructor () {
        super();
        this.state = {
            assignments: [],
        };
    }
    componentDidMount() {
        console.log('aba');
        this.props.fetch();
        this.setState({assignments: this.props.thread.assignments || []});
    }
    componentDidUpdate(prevProps) {
        console.log("asdasda");
        if((prevProps.thread.assignments !== this.props.thread.assignments) && this.state.assignments.length === 0)
            this.setState({assignments: this.props.thread.assignments || []});
    }
    handleCheckChange(userId) {
        let a = this.state.assignments;
        let b = a[userId];
        b.assigned_to_thread = !b.assigned_to_thread;
        this.setState({assignments: {
            ...a,
            [userId]: b
        }});
        // this.setState({assignments: update(this.state.assignments, {index: {assigned_to_thread: {$set: !this.state.assignments[index].assigned_to_thread}}})})
        // this.setState({assignments: [...this.state.assignments, this.state.assignments[index] = {'b'}]})
    }
    saveData() {
        this.props.updateAssignments(this.state.assignments);
    }

    render () {
        let assignments = this.state.assignments;
        let l = Object.keys(assignments).map((key,index)=> {
            const a = assignments[key];
            return(<li key={a.id}>
                {a.displayName}
                <input type="checkbox" checked={a.assigned_to_thread} onChange={()=>{this.handleCheckChange(key)}}/>
            </li>)});
        return (
            <ReactModal
                isOpen={this.props.isOpen}
                onRequestClose={this.props.close}
                shouldCloseOnOverlayClick={true}
                contentLabel="Thread Assignments">

                <ul>
                    {l}
                </ul>
                {/*<pre>{JSON.stringify(this.props.thread.assignments,null, 2)}</pre>*/}
                hi
                <button className="btn-primary" onClick={this.props.close}>Close Modal</button>
                <button className="btn-secondary" onClick={this.saveData.bind(this)}>Save</button>


            </ReactModal>
        );
    }
}

