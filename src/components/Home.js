import React from 'react';

import Login from './Login/Login';

class Home extends React.Component {

    render () {
        return (
            <div className="Home">
                <Login />
            </div>
        );
    }
}

export default Home;