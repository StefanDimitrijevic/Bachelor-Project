import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';

import Home from './components/Home';
import User from './components/User';
import Register from './components/Register/Register';
import Address from './components/Address/Address';

class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <Route path="/" exact component={Home} />
                    <Route path="/register" exact component={Register} />
                    <Route path={`/user/:id`} component={User} />
                    <Route path={`/address/:id`} exact component={Address} />
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
