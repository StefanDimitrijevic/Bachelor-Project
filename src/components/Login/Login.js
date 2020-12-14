/* eslint-disable default-case */
import React from 'react';
import { Link, withRouter } from "react-router-dom";
import fire from '../../Firebase/init';

import './Login.scss'

class Login extends React.Component {

    state = {
        user: '',
        email: '',
        password: '',
        emailError: '',
        passwordError: ''
    }

    componentDidMount() {
        this.authListener();
        console.log('hey', this.state.user)
    }

    handeLogin = () => {
        const { email, password } = this.state;
        this.clearErrors();

        // fire.firestore().collection('users').doc(test);
        fire.auth().signInWithEmailAndPassword(email, password)
        .catch(err => {
            switch(err.code){
                case 'auth/invalid-email':
                case 'auth/user-disabled':
                case 'auth/user-not-found':
                    this.setState({
                        emailError: err.message
                    });
                break;
                case 'auth/wrong-password':
                    this.setState({
                        passwordError: err.message
                    });
                break;
            }
        })
    }

    navigate = (id) => {
        this.props.history.push(`/user/${id}`);
    };

    authListener = () => {
        fire.auth().onAuthStateChanged(user => {
            if(user){
                this.clearInputs();
                this.setState({
                    user: user.uid
                })
                setTimeout(() => { this.navigate(this.state.user); }, 1000);
            } else {
                this.setState({
                    user: ''
                })
            }
        })
    }

    handleLogout = () => {
        fire.auth().signOut();
    }

    clearInputs = () => {
        this.setState({
            email: '',
            password: ''
        });
    }

    clearErrors = () => {
        this.setState({
            emailError: '',
            passwordError: ''
        });
    }

    render() {
        const { email, password, emailError, passwordError, user } = this.state;

        console.log('email: ', email, ' password: ', password, ' user: ', user )
        return (
            <div className="Login">
                <div className="Intro">
                    <img className="Logo" src={`${process.env.PUBLIC_URL}/images/logo.png`} alt="logo" />
                    <p>H.C. Andersens</p>
                    <h1>Billede app</h1>
                </div>
                <div className="Container">
                    <div className="Form">
                        <div className="InputContainer">
                            <img className="icon" src={`${process.env.PUBLIC_URL}/images/email.png`} alt="email" />
                            <input 
                                type="text"
                                placeholder="Email"
                                autoComplete="nope"
                                required
                                value={ email }
                                onChange={ e => this.setState({ email: e.target.value }) }
                            />
                        </div>
                            <p className="error">{ emailError }</p>
                        <div className="InputContainer">
                            <img className="icon" src={`${process.env.PUBLIC_URL}/images/password.png`} alt="email" />
                            <input 
                                type="password"
                                placeholder="Password"
                                autoComplete="new-password"
                                required
                                value={ password }
                                onChange={ e => this.setState({ password: e.target.value }) }
                            />
                        </div>
                            <p className="error">{ passwordError }</p>
                            <div className="BtnContainer">
                                    <>
                                    <button className="addButton" onClick={ this.handeLogin }>Log ind</button>
                                    <p>IKKE BRUGER? <span><Link to="/register">OPRET NU!</Link></span></p>
                                    </>
                            </div>
                    </div>
                </div>
                {/* { user ? <button onClick={this.handleLogout}>Log out</button> : 'not logged in' }
                <input type="file" accept="image/*" capture="camera" /> */}
            </div>
        );
    }
}

export default withRouter(Login);