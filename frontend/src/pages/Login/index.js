import React, { Component } from 'react';
import LoginForm from './LoginForm'
import { SubmissionError } from 'redux-form'
import { Redirect, Link } from 'react-router-dom'
import apiFetch from '../../actions';
import logo from '../../assets/images/logo.png'
import {toastr} from 'react-redux-toastr'

export class Login extends Component {

    constructor (props) {
        super(props);
        this.state = { redirectToReferrer: false };
    }

    handleSubmit = (values) => {
        let d = new FormData();
        d.append('email', values.email);
        d.append('password', values.password);
        return apiFetch(`auth/login`,{
            method: 'POST',
            body: d
        }).then((response) => response.json())
            .then((json) => {
                if(json.success === false) {
                    throw new SubmissionError({_error: json.message});
                }
                else {
                    this.props.loginFromJWT(json.data.token);
                }
            });
    };
    componentDidMount() {
        if(this.props.user.authenticated)
            this.setState({redirectToReferrer: true});

    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.user.authenticated) {
            if (nextProps.user !== this.user)
                toastr.success('Success!', "logged in!");
            this.setState({redirectToReferrer: true});
        }
    }

    render () {

        const { from } = this.props.location.state || { from: { pathname: '/inbox' } };

        if (this.state.redirectToReferrer) {
            //redirect them to the route they came from (or inbox) on successful auth.
            return (
                <Redirect to={from}/>
            )
        }
        return (
            <div className="login-container">
                <div className="login">
                    <img src={logo} alt="logo" className="login-logo"/>
                    <div className="login-header">Antelope</div>
                    <div className="login-catchphrase">herd your email</div>
                    <LoginForm onSubmit={this.handleSubmit}/>
                    <div>
                        <Link to="/reset" style={{color: "white"}}>forgot your password?</Link>
                    </div>
                </div>
            </div>
        );
    }
}

//now the redux integration layer
import { loginFromJWT } from '../../actions/users';
import { connect } from 'react-redux'
function mapStateToProps (state) {
    return {
        user: state.user
    };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    loginFromJWT: (token) => {
        dispatch(loginFromJWT(token));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);