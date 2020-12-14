/* eslint-disable no-useless-escape */
/* eslint-disable default-case */
import React from 'react';
import { Link, withRouter } from "react-router-dom";
import fire from '../../Firebase/init';
import slugify from 'slugify';

import './Register.scss'

class Register extends React.Component {

    state = {
        user: '',
        username: '',
        email: '',
        password: '',
        slug: '',
        emailError: '',
        passwordError: ''
    }

    componentDidMount() {
        this.authListener();
    }

    navigate = (id) => {
        this.props.history.push(`/user/${id}`);
    };

    handleSignup = () => {
        const { username, email, password } = this.state;
        this.clearErrors();

        if(username && email && password) {

            const test = slugify(username, {
                replacement: '-',
                remove: /[$*_+.()'"!\:@]/g,
                lower: true
            })

            this.setState({
                username: test
            }, () => {
                let ref = fire.firestore().collection('users').doc(test);
                ref.get()
                .then(doc => {
                    if(doc.exists) {
                        console.log('This alias already exists');
                    } else {
                        fire.auth().createUserWithEmailAndPassword(email, password)
                        .then(cred => {
                            ref.set({
                                username: username,
                                user_id: cred.user.uid
                            })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                    }
                })
            })
        }
    }

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
        const { username, email, password, emailError, passwordError, user } = this.state;

        return (
            <div className="Register">

                <div className="Intro">
                    <img className="Logo" src={`${process.env.PUBLIC_URL}/images/logo.png`} alt="logo" />
                    <p>H.C. Andersens</p>
                    <h1>Billede app</h1>
                </div>

                <div className="Container">
                    <div className="Form">
                        <div className="InputContainer">
                            <img className="icon" src={`${process.env.PUBLIC_URL}/images/user.png`} alt="email" />
                            <input 
                                type="text"
                                placeholder="Brugernavn"
                                autoComplete="nopeee"
                                required
                                value={ username }
                                onChange={ e => this.setState({ username: e.target.value })
                                }
                            />
                        </div>

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
                                    <button className="addButton" onClick={ this.handleSignup }>Opret</button>
                                    <p>ALLEREDE OPRETTET? <span><Link to="/">LOG IND</Link></span></p>
                                </>
                            </div>
                    </div>
                </div>
                {/* { user ? <button onClick={this.handleLogout}>Log out</button> : 'not logged in' } */}
            </div>
        );
    }
}

export default withRouter(Register);