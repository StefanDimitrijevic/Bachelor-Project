/* eslint-disable default-case */
import React from 'react';
import fire from '../Firebase/init';

class Login extends React.Component {

    state = {
        user: '',
        email: '',
        password: '',
        emailError: '',
        passwordError: '',
        hasAccount: false
    }

    componentDidMount() {
        this.authListener();
    }

    handeLogin = () => {
        const { email, password } = this.state;
        this.clearErrors();
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

    handleSignup = () => {
        const { email, password } = this.state;
        this.clearErrors();
        fire.auth().createUserWithEmailAndPassword(email, password)
        .catch(err => {
            switch(err.code){
                case 'auth/email-already-in-use':
                case 'auth/invalid-email':
                    this.setState({
                        emailError: err.message
                    });
                break;
                case 'auth/weak-password':
                    this.setState({
                        passwordError: err.message
                    });
                break;
            }
        })  
    }

    handleLogout = () => {
        fire.auth().signOut();
    }

    authListener = () => {
        fire.auth().onAuthStateChanged(user => {
            if(user){
                this.clearInputs();
                this.setState({
                    user: user
                })
            } else {
                this.setState({
                    user: ''
                })
            }
        })
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
        const { email, password, emailError, passwordError, hasAccount } = this.state;
        console.log('email: ', email, ' password: ', password )
        return (
            <div className="Login">
                <div className="Container">
                    <label>Email</label>
                    <input 
                        type="text"
                        required
                        value={ email }
                        onChange={ e => this.setState({ email: e.target.value }) }
                    />
                    <p className="error">{ emailError }</p>

                    <label>Password</label>
                    <input 
                        type="password"
                        required
                        value={ password }
                        onChange={ e => this.setState({ password: e.target.value }) }
                    />
                    <p className="error">{ passwordError }</p>
                    <div className="BtnContainer">
                        { hasAccount ? (
                            <>
                            <button onClick={ this.handeLogin }>Sign in</button>
                            <p>Don't have an account ? <span onClick={ () => this.setState({ hasAccount: !hasAccount })}>Sign up</span></p>
                            </>
                        ) : (
                            <>
                            <button onClick={ this.handleSignup }>Sign up</button>
                            <p>Have an account ? <span onClick={ () => this.setState({ hasAccount: !hasAccount })}>Sign in</span></p>
                            </>
                        ) }
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;