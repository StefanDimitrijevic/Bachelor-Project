import React from 'react';
import fire from '../Firebase/init';
import { Link } from "react-router-dom";

import './User.scss';
import Navbar from './Navbar/Navbar';

class User extends React.Component{

    state = {
        user: null,
        profile: null,
        visible: false,
        address: '',
        zipcode: '',
        selectValue: '',
        addresses: [],
        sortAddresses: false,
        walls: false,
        woodWork: false,
        floors: false,
        wallAddresses: [],
        woodAddresses: [],
        floorAddresses: []
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

        let userParam = this.props.match.params.id;

        let ref = fire.firestore().collection('users').where('user_id', '==', userParam)
        ref.get().then(snapshot => {
            snapshot.forEach(doc => {
                let user = doc.data();
                this.setState({
                    profile: user
                })
        })
        })

        fire.firestore().collection('address')
        .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                let doc = change.doc
                // console.log(doc.data())

                // Get all data from the doc
                let address = doc.data()

                // set the id of the order to the id of the doc
                address.id = doc.id

                if(change.type === 'added') {
				// Pushing the order into the order array
                this.setState(prevState => {
                    return {
                        addresses: [...prevState.addresses, address]
                    }
                });
                }
            })
        });
    }

    showPopup = () => {
        this.setState({
            visible: true
        })
    }

    hidePopup = () => {
        this.setState({
            visible: false
        })
    }

    handleChange = (e) => {
        this.setState({
            selectValue: e.target.value
        });
    }

    addAddress = () => {
        const { user, selectValue, address, zipcode } = this.state;

        fire.firestore().collection('address').add({
            address,
            zipcode,
            kategory: selectValue,
            user: user.email,
            hasImageBefore: false,
            hasImageDuring: false,
            hasImageAfter: false
        }).catch(err => {
            console.log(err);
        });

        this.setState({
            visible: false
        })
    }

    // What circle status to render depending on what images are uploaded
    renderOption = (status) => {
        if(status.hasImageBefore && !status.hasImageDuring) {
            return <div className="circle yellow" />
        } else if(status.hasImageDuring && !status.hasImageAfter) {
            return <div className="circle yellow" />
        } else if(status.hasImageBefore && status.hasImageDuring && status.hasImageAfter) {
            return <div className="circle green" />
        } else if(!status.hasImageBefore && !status.hasImageDuring && !status.hasImageAfter) {
            return <div className="circle red" />
        }
    }

    deleteAddress = (id) => {
        const { addresses } = this.state;

        fire.firestore().collection('address').doc(id).delete()
        .then(() => {
            let updatedAddresses = addresses.filter(address => {
                return address.id !== id
            })

            let filteredWallAddresses = updatedAddresses.filter(address => {
                return address.kategory === 'Murværk'
            })

            let filteredWoodAddresses = updatedAddresses.filter(address => {
                return address.kategory === 'Tømrearbejde'
            })

            let filteredFloorAddresses = updatedAddresses.filter(address => {
                return address.kategory === 'Gulvslibning'
            })

            this.setState({
                addresses: updatedAddresses,
                wallAddresses: filteredWallAddresses,
                woodAddresses: filteredWoodAddresses,
                floorAddresses: filteredFloorAddresses
            })
        })

    }

    // function that determines if to display sort list or not
    sort = () => {
        this.setState({
            sortAddresses: !this.state.sortAddresses
        })
    }

    walls = () => {

        let ref = fire.firestore().collection('address').where('kategory', '==', 'Murværk')
        ref.onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                let doc = change.doc
                // console.log(doc.data())

                // Get all data from the doc
                let filteredAddresses = doc.data()

                // set the id of the order to the id of the doc
                filteredAddresses.id = doc.id

                if(change.type === 'added') {
				// Pushing the order into the order array
                this.setState(prevState => {
                    return {
                        wallAddresses: [...prevState.wallAddresses, filteredAddresses],
                        walls: true,
                        woodAddresses: [],
                        floorAddresses: [],
                        woodWork: false,
                        floors: false,
                        sortAddresses: false
                    }
                });
                }
            })
        });

    }

    woodWork = () => {
        let ref = fire.firestore().collection('address').where('kategory', '==', 'Tømrearbejde')
        ref.onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                let doc = change.doc
                // console.log(doc.data())

                // Get all data from the doc
                let filteredAddresses = doc.data()

                // set the id of the order to the id of the doc
                filteredAddresses.id = doc.id

                if(change.type === 'added') {
				// Pushing the order into the order array
                this.setState(prevState => {
                    return {
                        woodAddresses: [...prevState.woodAddresses, filteredAddresses],
                        woodWork: true,
                        wallAddresses: [],
                        floorAddresses: [],
                        walls: false,
                        floors: false,
                        sortAddresses: false
                    }
                });
                }
            })
        });
    }

    floors = () => {
        let ref = fire.firestore().collection('address').where('kategory', '==', 'Gulvslibning')
        ref.onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                let doc = change.doc
                // console.log(doc.data())

                // Get all data from the doc
                let filteredAddresses = doc.data()

                // set the id of the order to the id of the doc
                filteredAddresses.id = doc.id

                if(change.type === 'added') {
				// Pushing the order into the order array
                this.setState(prevState => {
                    return {
                        floorAddresses: [...prevState.floorAddresses, filteredAddresses],
                        floors: true,
                        wallAddresses: [],
                        woodAddresses: [],
                        woodWork: false,
                        walls: false,
                        sortAddresses: false
                    }
                });
                }
            })
        });
    }

    filterRender = () => {
        const { walls, woodWork, floors, addresses, wallAddresses, woodAddresses, floorAddresses } = this.state;

        if(walls) {
            return (
                wallAddresses.map(address => {
                    return (
                        <div>
                            <li className={`list`}>
                                <div className="delete" onClick={ () => this.deleteAddress(address.id) }>
                                    <p>x</p>
                                </div>
                                <Link key={address.id} to={`/address/${address.address}`}>
                                    <p className="category">{address.kategory}</p>
                                    <p className="address">{address.address}</p>
                                    { this.renderOption(address) }
                                </Link>
                            </li>
                        </div>
                    )
                })
            )
        } else if(woodWork) {
            return (
                woodAddresses.map(address => {
                    return (
                        <div>
                            <li className={`list`}>
                                <div className="delete" onClick={ () => this.deleteAddress(address.id) }>
                                    <p>x</p>
                                </div>
                                <Link key={address.id} to={`/address/${address.address}`}>
                                    <p className="category">{address.kategory}</p>
                                    <p className="address">{address.address}</p>
                                    { this.renderOption(address) }
                                </Link>
                            </li>
                        </div>
                    )
                })
            )
        } else if(floors) {
            return (
                floorAddresses.map(address => {
                    return (
                        <div>
                            <li className={`list`}>
                                <div className="delete" onClick={ () => this.deleteAddress(address.id) }>
                                    <p>x</p>
                                </div>
                                <Link key={address.id} to={`/address/${address.address}`}>
                                    <p className="category">{address.kategory}</p>
                                    <p className="address">{address.address}</p>
                                    { this.renderOption(address) }
                                </Link>
                            </li>
                        </div>
                    )
                })
            )
        } else {
            return (
                addresses.map(address => {
                    return (
                        <div>
                            <li className={`list`}>
                                <div className="delete" onClick={ () => this.deleteAddress(address.id) }>
                                    <p>x</p>
                                </div>
                                <Link key={address.id} to={`/address/${address.address}`}>
                                    <p className="category">{address.kategory}</p>
                                    <p className="address">{address.address}</p>
                                    { this.renderOption(address) }
                                </Link>
                            </li>
                        </div>
                    )
                })
            )
        }
    }


    render() {
        const { visible, selectValue, address, zipcode, addresses, sortAddresses, newAddresses } = this.state;

        const whatArrow = sortAddresses ? <img src={`${process.env.PUBLIC_URL}/images/arrow-up.png`} alt="arrow" /> : <img src={`${process.env.PUBLIC_URL}/images/arrow-down.png`} alt="arrow" /> 

        

        return (
            <div className="User">
                <Navbar />
                <div className="Intro">
                    <img className="Logo" src={`${process.env.PUBLIC_URL}/images/logo.png`} alt="logo" />
                    <p>H.C. Andersens</p>
                    <h1>Billede app</h1>
                </div>
                <p>Status</p>
                <div className="status-wrap">
                    <div className="test">
                        <div className="circle"></div>
                        <p>Mangler billeder</p>
                    </div>
                    <div className="test">
                        <div className="circle"></div>
                        <p>Mangler et eller flere billeder</p>
                    </div>
                    <div className="test">
                        <div className="circle"></div>
                        <p>Mangler 0 billeder</p>
                    </div>
                </div>

                <div className="AddressList">
                    <div className="Sorting">
                        <button onClick={ this.sort }>
                            Sorter
                            { whatArrow }
                        </button>
                        <ul className={`${sortAddresses ? 'active' : ''}`}>
                            <li onClick={ this.walls }>Murværk</li>
                            <li onClick={ this.woodWork }>Tømrearbejde</li>
                            <li onClick={ this.floors }>Gulvslibning</li>
                        </ul>
                    </div>
                    <ul>
                        {
                            this.filterRender()
                        }
                    </ul>
                </div>

                <button className="addButton" onClick={this.showPopup}>Tilføj ny</button>

                <div className={`Popup ${visible ? 'active' : ''}`}>
                    <div className="Popup__content">
                        <div className="Popup__close" onClick={this.hidePopup}>x</div>
                        <p className="Popup__Title">Tilføj nyt projekt</p>
                        <p className="Popup__Text">
                            Hvis du ønsker at tilføje et nyt projekt til oversigten,
                            skal du blot udfylde understående formular og trykke "Tilføj ny"
                        </p>
                        <div className="inputs">
                        
                            <select value={ selectValue } onChange={ this.handleChange }>
                                <option>kategori</option>
                                <option value="Gulvslibning">Gulvslibning</option>
                                <option value="Murværk">Murværk</option>
                                <option value="Tømrearbejde">Tømrer</option>
                            </select>
                        
                            <input
                                className="zip"
                                type="number"
                                placeholder="Område / by..."
                                value={ zipcode }
                                onChange={ e => this.setState({ zipcode: e.target.value }) }
                            />

                            <input 
                                type="text"
                                placeholder="Adresse..."
                                value={ address }
                                onChange={ e => this.setState({ address: e.target.value }) }
                            />

                            <button className="addButton" onClick={ this.addAddress }>Tilføj ny</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default User;