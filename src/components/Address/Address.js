import React, { Component } from 'react';
import fire from '../../Firebase/init';

import './Address.scss';

class Address extends Component {

    fileObj = [];
    fileArray = [];

    state = {
        address: null,
        id: null,
        category: null,
        file: null,
        imgURL: [],
        imgRef: [],
        images: [],
        whichIsClicked: '',
        visible: false
    }

    componentDidMount() {
        // Converting url param to int
        let paramToNumb = this.props.match.params.id;
        // Storing the reference to this document in a variable, where the orderCount in the db is equal to the route parameter id
        let ref = fire.firestore().collection('address').where('address', '==', paramToNumb)
        ref.get().then(snapshot => {
            snapshot.forEach(doc => {
                let address = doc.data()
                address.id = doc.id

                this.setState({
                    address: address.address,
                    id: address.id,
                    category: address.kategory
                })
            })
        })
    }

    openCamera = () => {
        document.getElementById("upfile").click();

        this.setState({
            whichIsClicked: 'before'
        })
    }

    openCameraDuring = () => {
        document.getElementById("upfile1").click();

        this.setState({
            whichIsClicked: 'during'
        })
    }

    openCameraAfter = () => {
        document.getElementById("upfile2").click();

        this.setState({
            whichIsClicked: 'after'
        })
    }

    handleChange = (e) => {
        this.fileObj.push(e.target.files)
        for (let i = 0; i < this.fileObj[0].length; i++) {
            this.fileArray.push(URL.createObjectURL(this.fileObj[0][i]))
        }
        this.setState({ file: this.fileArray })
    }

    imgRender = () => {
        const { file } = this.state;
        if(file) {
            return (this.fileArray || []).map(url => (
                <img src={url} alt="..." />
            ))
        } else {
            return ''
        }
    }

    uploadImages = () => {
        const { whichIsClicked } = this.state;

        for (let i = 0; i < this.fileObj[0].length; ++i) {
            let name = this.fileObj[0].item(i).name;
            
        // Create a storage reference, we use Date.now() to give it a unique name
        let storageRef = fire.storage().ref('photos/' + Date.now() + name)

        // Save image reference, if we want to delete the picture
        // this.setState({imgRef: storageRef.fullPath});

        this.setState(prevState => {
            return {
                imgRef: [...prevState.imgRef, storageRef.fullPath]
            }
        });

        // Upload file
        let task = storageRef.put(this.fileObj[0].item(i))

        task.on('state_changed', (snapshot) => {
            snapshot.ref.getDownloadURL().then((downloadURL) => {
                // Save the image URL, if we want to view the image on the page

                this.setState(prevState => {
                    return {
                        imgURL: [...prevState.imgURL, downloadURL]
                    }
                });
            })
        })

        }

        // Which database call function to use depending on which file upload button is clicked
        if(whichIsClicked === 'before') {
            setTimeout(() => {
                this.addImageBeforeToDB();
            },2000)
        }

        if(whichIsClicked === 'during') {
            setTimeout(() => {
                this.addImageDuringToDB();
            },2000)
        }

        if(whichIsClicked === 'after') {
            setTimeout(() => {
                this.addImageAfterToDB();
            },2000)
        }
    }

    addImageBeforeToDB = () => {
        const { id, imgURL, imgRef } = this.state;

        fire.firestore().collection('address').doc(id).update({
            imgRefBefore: imgRef,
            imgUrlBefore: imgURL,
            hasImageBefore: true
        })

        this.setState({
            imgRef: [],
            imgURL: [],
            file: null
        })

        this.fileObj = [];
        this.fileArray = [];
    }

    addImageDuringToDB = () => {
        const { id, imgURL, imgRef } = this.state;

        fire.firestore().collection('address').doc(id).update({
            imgRefDuring: imgRef,
            imgUrlDuring: imgURL,
            hasImageDuring: true
        })

        this.setState({
            imgRef: [],
            imgURL: [],
            file: null
        })

        this.fileObj = [];
        this.fileArray = [];
    }

    addImageAfterToDB = () => {
        const { id, imgURL, imgRef } = this.state;

        fire.firestore().collection('address').doc(id).update({
            imgRefAfter: imgRef,
            imgUrlAfter: imgURL,
            hasImageAfter: true
        })

        this.setState({
            imgRef: [],
            imgURL: [],
            file: null
        })

        this.fileObj = [];
        this.fileArray = [];
    }

    openModal = () => {
        this.setState({ visible: true })
        document.body.style.overflowY = "hidden";
        window.scrollTo({ top: 0, behavior: 'smooth' });

    }

    closeModal = () => {
        this.setState({ visible: false })
        document.body.style.overflowY = "initial";
    }

    render() {
        const { address, category, imgRef, imgURL, whichIsClicked, visible } = this.state;

        console.log('Image reference: ', imgRef, '. Image URL: ', imgURL)
        

        return (
            <div className="Address">
                <div className="Intro">
                    <img className="Logo" src={`${process.env.PUBLIC_URL}/images/logo.png`} alt="logo" />
                    <p>H.C. Andersens</p>
                    <h1>Billede app</h1>
                </div>
                <button className="addButton" onClick={ this.openModal }>Billede guide</button>
                <div className="Header">
                    <h3 className="Title">{ category }</h3>
                    <p className="Desc">{ address }</p>
                </div>

                <p className="ImageDesc">Før billeder:</p>
                <div className="ImageFrame" id="before" onClick={ this.openCamera }>
                    <input 
                        id="upfile"
                        type="file"
                        accept="image/*"
                        capture="camera"
                        multiple
                        onChange={ this.handleChange }
                    />
                    <p>Åbner kamera på telefon ved tryk</p>
                    <img src={`${process.env.PUBLIC_URL}/images/placeholder.png`} alt="placeholder" />
                </div>

                {
                    whichIsClicked === 'before' ? <div id="img-preview"> {this.imgRender()} </div> : <div id="img-preview"> <img src={`${process.env.PUBLIC_URL}/images/placeholder.png`} alt="placeholder" /> <img src={`${process.env.PUBLIC_URL}/images/placeholder.png`} alt="placeholder" /> <img src={`${process.env.PUBLIC_URL}/images/placeholder.png`} alt="placeholder" /> <img src={`${process.env.PUBLIC_URL}/images/placeholder.png`} alt="placeholder" /> </div>
                }

                <button className="addButton" onClick={ this.uploadImages }>Tilføj billeder</button>


                <p className="ImageDesc">Under billeder:</p>
                <div className="ImageFrame" id="during" onClick={ this.openCameraDuring }>
                    <input 
                        id="upfile1"
                        type="file"
                        accept="image/*"
                        capture="camera"
                        multiple
                        onChange={ this.handleChange }
                    />
                    <p>Åbner kamera på telefon ved tryk</p>
                    <img src={`${process.env.PUBLIC_URL}/images/placeholder.png`} alt="placeholder" />
                </div>

                    {
                        whichIsClicked === 'during' ? <div id="img-preview"> {this.imgRender()} </div> : <div id="img-preview"> <img src={`${process.env.PUBLIC_URL}/images/placeholder.png`} alt="placeholder" /> <img src={`${process.env.PUBLIC_URL}/images/placeholder.png`} alt="placeholder" /> <img src={`${process.env.PUBLIC_URL}/images/placeholder.png`} alt="placeholder" /> <img src={`${process.env.PUBLIC_URL}/images/placeholder.png`} alt="placeholder" /> </div>
                    }

                <button className="addButton" onClick={ this.uploadImages }>Tilføj billeder</button>


                <p className="ImageDesc">Efter billeder:</p>
                <div className="ImageFrame" id="after" onClick={ this.openCameraAfter }>
                    <input 
                        id="upfile2"
                        type="file"
                        accept="image/*"
                        capture="camera"
                        multiple
                        onChange={ this.handleChange }
                    />
                    <p>Åbner kamera på telefon ved tryk</p>
                    <img src={`${process.env.PUBLIC_URL}/images/placeholder.png`} alt="placeholder" />
                </div>

                {
                    whichIsClicked === 'after' ? <div id="img-preview"> {this.imgRender()} </div> : <div id="img-preview"> <img src={`${process.env.PUBLIC_URL}/images/placeholder.png`} alt="placeholder" /> <img src={`${process.env.PUBLIC_URL}/images/placeholder.png`} alt="placeholder" /> <img src={`${process.env.PUBLIC_URL}/images/placeholder.png`} alt="placeholder" /> <img src={`${process.env.PUBLIC_URL}/images/placeholder.png`} alt="placeholder" /> </div>
                }

                <button className="addButton" onClick={ this.uploadImages }>Tilføj billeder</button>

                <div className={`Popup ${visible ? 'active' : ''}`}>
                    <div className="Popup__content">
                        <div className="Popup__close" onClick={ this.closeModal }>x</div>
                        <div className="Intro">
                            <img className="Logo" src={`${process.env.PUBLIC_URL}/images/logo.png`} alt="logo" />
                            <p>H.C. Andersens</p>
                            <h1>Billede app</h1>
                        </div>
                        <p className="Popup__Text">
                            Billeder er ikke bare billeder. Det er vigtigt, at billederne der bliver taget og tilføjet er af en kvalitet, som kan bruges på blandt andet sociale medier. Derfor giver vi dig her 4 gode råd til, hvordan du tager det perfekte billede.
                        </p>

                        <div className="Popup__Wrap">
                            <h1>1</h1>
                            <p className="Popup__Manual">
                                Sørg altid for, at vende din telefon i en vandret / horisontal vinkel. Det giver os det bedste billede, da vi kan få mest muligt med på billedet. Vi kan altid beskære billedet, hvis det er nødvendigt.
                            </p>
                        </div>
                        <div className="Popup__Wrap">
                            <h1>2</h1>
                            <p className="Popup__Manual">
                                Billederne der bliver taget og tilføjes, skal bruges på blandt andet sociale platforme. Derfor er det selvfølgelig vigtigt, at billederne er præsentable at se på. Sørg derfor altid for, at der ikke ligger/er objekter som værktøj eller andet, som kan ses på billederne. Sørg generelt for, at der er rent når billederne tages.
                            </p>
                        </div>

                        <div className="Popup__Wrap">
                            <h1>3</h1>
                            <p className="Popup__Manual">
                                Belysningen på billederne er meget vigtigt. Der må hverken være for meget lys eller for lidt lys. Sørg for, at belysningen er passende når billederne tages. Som tommelfingerregel, er det altid bedre med for meget lys, end for lidt lys. Brug ALDRIG blitz på billederne.
                            </p>
                        </div>

                        <div className="Popup__Wrap">
                            <h1>4</h1>
                            <p className="Popup__Manual">
                                Der kan tilføjes tolv billeder i alt per projekt. Fire billeder til før, under samt efter. Sørg derfor for, at billederne er lidt forskellige. Prøv forskellige vinkler. Tæt på, langt fra, nede eller oppe fra. Jo flere muligheder, jo bedre.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default Address;