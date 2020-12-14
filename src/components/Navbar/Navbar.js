import React from 'react';
import fire from '../../Firebase/init';
import { withRouter } from "react-router-dom";

import './Navbar.scss';

class Navbar extends React.Component{

    state = {
        user: null
    }

    componentDidMount() {
        fire.auth().onAuthStateChanged(user => {
            if(user) {
                this.setState({
                    user: user
                })
            } else {
                this.setState({
                    user: null
                })
            }
        })
    }

    handleLogout = () => {
        fire.auth().signOut();
        this.props.history.push('/');
    }
    render() {
        const uEmail = this.state.user ? <p>{this.state.user.email}</p> : '';
        return (
            <div className="Navbar">
                <ul>
                    <li className="User"><img className="icon" src={`${process.env.PUBLIC_URL}/images/user.png`} alt="email" />{ uEmail }</li>
                    <li>
                        <button className="Logout"onClick={this.handleLogout}>Logout</button>
                    </li>
                </ul>
            </div>
        )
    }
}

export default withRouter(Navbar);