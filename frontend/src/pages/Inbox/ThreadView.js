import React, { Component } from 'react';
class ThreadView extends Component {
    render () {
        return (
            <div className="inbox-column right">
                <div className="inbox-column-bottom" style={{padding: '5px'}}>
                    <h1>ThreadView: {this.props.threadId}</h1>
                    <pre style={{width: '200px'}}>
                        {JSON.stringify(this.props.user.me,null, 2)}
                    </pre>
                    {this.props.threadId ? `Viewing thread ${this.props.threadId}` : 'no threaad selected'}
                    <h3>hi</h3>
                    <div style={{width: '50%', backgroundColor: 'blue'}}>hi</div>
                    <div style={{width: '100%', backgroundColor: 'red'}}>hi</div>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis quam massa</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis quam massa</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis quam massa</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis quam massa</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis quam massa</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis quam massa</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis quam massa</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis quam massa</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis quam massa</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis quam massa</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis quam massa</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis quam massa</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis quam massa</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis quam massa</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis quam massa</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis quam massa</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis quam massa</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis quam massa</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis quam massa</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis quam massa</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis quam massa</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis quam massa</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis quam massa</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis quam massa</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis quam massa</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis quam massa</p>
                </div>
            </div>
        );
    }
}

//now the redux integration layer
import { connect } from 'react-redux'
function mapStateToProps (state) {
    return {
        user: state.user
    };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ThreadView);