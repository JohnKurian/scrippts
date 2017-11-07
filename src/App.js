import React, { Component } from 'react';
import './App.css';
import './Node.css';
import './Layout.css';


import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch,
    withRouter
} from 'react-router-dom'

import Modal from 'react-modal';

import ReactTooltip from 'react-tooltip'

var firebase = require("firebase");
require("firebase/firestore");

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};


var config = {
    apiKey: "AIzaSyAg-UlKP9oonj4IMo5op6qEAOzFXHZloiY",
    authDomain: "argument-app.firebaseapp.com",
    databaseURL: "https://argument-app.firebaseio.com",
    projectId: "argument-app",
    storageBucket: "argument-app.appspot.com",
    messagingSenderId: "626987124454"
};

firebase.initializeApp(config);

var db = firebase.firestore();
export const auth = firebase.auth


class Loader extends Component {

    render() {
        return (
            <div>
                <svg className="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                    <circle className="path" fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"/>
                </svg>
            </div>
        )
    }
}

class Node extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text: ''
        };
    }



    onChange = (node, evt) => {
        // console.log('value:', evt.target.value)
        // console.log(node)
        this.setState({text: evt.target.value})

    }


    onTextAreaClick(node, evt) {
        console.log('text area clicked:', evt.target.style.height, evt.target.style.width)
    }

    onFocus(node, evt) {
        console.log('onFocus')
    }

    onBlur(node, evt) {
        console.log('onBlur')
    }

    onAddClick(node, contentionType, evt) {

        //attach child node to flat object

        if(node['contentionType']==='however' && contentionType==='however') {
            console.log("can't cascade two howevers");
            return;
        }

        let relativeToParent = {
            'because': 1,
            'and': 1,
            'however': 0,
            'but': -1
        };

        db.collection("scripts").doc(this.props.scriptId).collection('nodes').add({
            parentUid: node.uid,
            contentionType: contentionType,
            relativeToParent: relativeToParent[contentionType],
            text: '',
            createdTime: Date.now(),
            updatedTime: Date.now()
        })
            .then(function(nodeRef) {
                console.log("node written with ID: ", nodeRef.id);
                db.collection("scripts").doc(this.props.scriptId).collection('nodes').doc(nodeRef.id).update({uid: nodeRef.id});

                let childObj = {};
                childObj['children.' + nodeRef.id] = true;
                db.collection("scripts").doc(this.props.scriptId).collection('nodes').doc(node['uid']).update(childObj);

            }.bind(this))
            .catch(function(error) {
                console.error("Error adding node: ", error);
            }.bind(this));

    }


    onSaveClick(node) {

        //attach child node to flat object
        console.log('im in here')
        db.collection("scripts").doc(this.props.scriptId).collection('nodes').doc(node['uid']).update({
            text: this.state.text,
            updatedTime: Date.now()
        })

    }

    render() {

        if(this.props.data===undefined) {
            return null;
        }

        let colorMap = {
            '1': '#e8f5e9',
            '-1': '#ffebee',
            '0': '#fff8e1'
        };

        let labelMap = {
            '1': 'because',
            '-1': 'but',
            '0': 'however'
        };

        let labelColorMap = {
            '1': '#66BB6A',
            '-1': '#EF5350',
            '0': '#FFCA28'
        };


        let color = '';
        let labelColor = '';



        return (
            <ul>
                {

                    Object.keys(this.props.data).map(function(key, index) {

                        let node = this.props.data[key];

                        let currentNodeValue = 0;
                        let nodeHeader = null;
                        if(this.props.premiseRelativeValue!==null||this.props.premiseRelativeValue!==undefined) {

                            currentNodeValue = this.props.premiseRelativeValue * node['relativeToParent'];
                            color = colorMap[currentNodeValue];
                            labelColor = labelColorMap[currentNodeValue];

                            if(currentNodeValue===0 && this.props.premiseRelativeValue===1) {
                             currentNodeValue = -1;
                            }
                            else if(currentNodeValue===0 && this.props.premiseRelativeValue===-1) {
                                currentNodeValue = 1;
                            }
                        }

                        if(node.uid!==this.props.parentNodeId) {
                            nodeHeader = (
                                    <p style={{color: labelColor, margin: 0}}>{labelMap[node.relativeToParent]}</p>
                            );
                        }


                        return (
                            <li key={node.uid}>
                                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                    <div style={{
                                        background: 'white',
                                        padding: '10px',
                                        borderRadius: '6px',
                                        boxShadow: '2px 2px 8px rgba(0,0,0,.3)'
                                    }}>
                                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                            <div style={{flex: 1}}>
                                            {nodeHeader}
                                            </div>
                                            <div style={{flex: 0}}>
                                            <i data-tip data-for='save' onClick={this.onSaveClick.bind(this, node)} className="material-icons" style={{cursor: 'pointer', color: '#9e9e9e' }}>save</i>
                                            </div>
                                                <ReactTooltip id='save' effect='solid'>
                                                <span>Save changes</span>
                                            </ReactTooltip>

                                        </div>

                                        <textarea
                                            id={node.uid}
                                            key={node.text}
                                            style={{background: color}}
                                            onFocus={this.onFocus.bind(this, node)}
                                            onBlur={this.onBlur.bind(this, node)}
                                            onChange={this.onChange.bind(this, node)}
                                            onClick={this.onTextAreaClick.bind(this, node)}
                                            defaultValue={node.text}>
                                        </textarea>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>

                                            <i data-tip='custom show' data-event='click focus' onClick={()=>{console.log('im in here')}} className="material-icons" style={{ cursor: 'pointer', color: '#9e9e9e' }}>add_circle</i>
                                            <ReactTooltip globalEventOff='click' place="bottom" />

                                            <button style={{  background: '#ef5350', cursor: 'pointer', borderColor: '#ef5350', color: '#fff', borderRadius: '10px', outline: '0'}} onClick={this.onAddClick.bind(this, node, "but")} type="button">but</button>
                                            <button style={{  background: '#66bb6a', cursor: 'pointer', borderColor: '#66bb6a', color: '#fff', borderRadius: '10px', outline: '0'}} onClick={this.onAddClick.bind(this, node, "because")} type="button">because</button>
                                        </div>
                                    </div>
                                </div>
                                {<Node data={node.children} parentNodeId={this.props.parentNodeId} scriptId={this.props.scriptId} premiseRelativeValue={currentNodeValue}/>}
                            </li>
                        )
                    }.bind(this))

                }
            </ul>
        )

    }
}

class Home extends Component {

    render() {

        const SCRIPT_ROUTE = (scriptId) => `/s/${scriptId}/`;

        return (
            <div style={{marginLeft: '350px', marginTop: '100px'}}>
                {
                    this.props.scriptIds.map(function(id) {
                        return (
                            <div key={id}>
                                <Link to={SCRIPT_ROUTE(id)} params={{scriptId: id}}>{id}</Link>
                                <br/>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}


class Parent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sidebarOpen: false
        };
    }

    handleViewSidebar(){
        this.setState({sidebarOpen: !this.state.sidebarOpen});
    }

    disableSidebar(){
        this.setState({sidebarOpen: false});
    }

    render() {
        return (
            <div>
                <Header onClick={this.handleViewSidebar.bind(this)} />
                <SideBar isOpen={this.state.sidebarOpen} user={this.props.user}/>

                <Switch>
                    <Route exact path="/s/:scriptId" render={(props) => (
                        <Editor
                            {...props}
                            disableSidebar={this.disableSidebar.bind(this)}
                            isOpen={this.state.sidebarOpen}/>
                    )} />
                    <Route exact path="/" render={(props) => ( <Home {...props} scriptIds={this.props.scriptIds}/> )}/>
                </Switch>
            </div>
        );
    }
}

const LogoutButton = withRouter(({ history }) => (
        <input id="logout" type="button" value="logout" onClick={() => {
            auth().signOut();
            history.push('/');
        }} />
    )
);


class Header extends Component{

    render() {
        return (
            <header>
                <a href="javascript:;" onClick={this.props.onClick}>Toggle</a>
                <LogoutButton/>
            </header>
        );
    }
}

class SideBar extends Component{

    createNewScript() {
        console.log('writing to scripts collection...');

        db.collection("scripts").add({
            creator: this.props.user.uid,
            scope: 'private',
            createdTime: Date.now(),
            updatedTime: Date.now(),
            type: 'argument',
            collaborators: [this.props.user.uid]
        })
            .then(function(scriptRef) {
                console.log("Document written with ID: ", scriptRef.id);

                db.collection('scripts').doc(scriptRef.id).update({uid: scriptRef.id});

                let permissionObj = {};
                permissionObj['permission'] = 'write';
                db.collection('scripts').doc(scriptRef.id).collection('collaborators').doc(this.props.user.uid).set(permissionObj);

                db.collection('scripts').doc(scriptRef.id).collection('nodes').add({
                    text: ''
                })
                    .then(function (nodeRef) {

                        db.collection('scripts').doc(scriptRef.id).update({parentNodeId: nodeRef.id});

                        db.collection('scripts').doc(scriptRef.id).collection('nodes').doc(nodeRef.id).update({
                            parentUid: null,
                            relativeToParent: 1,
                            uid: nodeRef.id,
                            text: '',
                            createdTime: Date.now(),
                            updatedTime: Date.now()
                        }).then(function (nodeRef) {
                            console.log('script addition finished 2')
                        });

                        db.collection('users').doc(this.props.user.uid).collection('scripts').doc(scriptRef.id).set({
                            creator: true,
                            collaborator: true,
                            forked: false,
                            uid: scriptRef.id
                        });


                    }.bind(this))

            }.bind(this))
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
    }

    goToHome() {

    }

    render() {
        var sidebarClass = this.props.isOpen ? 'sidebar open' : 'sidebar';
        return (
            <div className={sidebarClass}>
                <div><Link to="/">Home</Link></div>
                <input id="newScript" type="button" value="Create new script" onClick={this.createNewScript.bind(this)} />
                <input id="home" type="button" value="Home" onClick={this.goToHome.bind(this)} />
            </div>
        );
    }
}

class Editor extends Component{

    constructor(props) {
        super(props);
        this.state = {
            tree: {},
            premiseNode: "",
            premiseRelativeValue: 1,
            centerLock: true
        };

        this.handleScroll = this.handleScroll.bind(this);

        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    convertFlatObjectToTree(flat) {
        var tree = {};
        Object.keys(flat).map(function (key, index) {
            var nodeKey = key;
            var node = flat[key];

            tree[key] = node;

            var children = node['children'];

            if(children!== undefined) {
                Object.keys(children).map(function (childNodeKey, index) {

                    if (children[childNodeKey] !== undefined) {
                        tree[nodeKey]['children'][childNodeKey] = flat[childNodeKey];
                    }

                });
            }

        });

        return tree;
    }


    handleScroll(event) {
        this.setState({'centerLock': false});
        window.removeEventListener('wheel', this.handleScroll);
    };


    componentDidMount() {


        if(this.state.centerLock) {

            if(document.getElementById(this.state.premiseNode)!==null) {
                let el = document.getElementById(this.state.premiseNode);

                let viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                let leftOffset = el.getBoundingClientRect()['x'];
                let elementWidth = el.getBoundingClientRect()['width'];

                let calculatedScroll = leftOffset + Math.max(viewportWidth/2) + Math.max(elementWidth/2);

                window.scrollTo(calculatedScroll, 0);
            }
        }

    }

    componentDidUpdate() {
        if(this.state.centerLock) {

            if(document.getElementById(this.state.premiseNode)!==null) {
                let el = document.getElementById(this.state.premiseNode);

                let viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                let leftOffset = el.getBoundingClientRect()['x'];
                let elementWidth = el.getBoundingClientRect()['width'];

                let calculatedLeftScroll = leftOffset - Math.max(viewportWidth/2) + Math.max(elementWidth/2);

                window.scrollTo(calculatedLeftScroll, 0);
            }
        }
    }


    componentWillMount() {

        this.props.disableSidebar();
        window.addEventListener('wheel', this.handleScroll);

        function fetchTree(retryCount) {
            retryCount += 1;

            return db.collection("scripts").doc(this.props.match.params.scriptId).collection('nodes')
                .onSnapshot(function (querySnapshot) {
                    var tempTree = {};
                    querySnapshot.forEach(function (doc) {
                        tempTree[doc.data().uid] = doc.data()
                    });

                    db.collection('scripts').doc(this.props.match.params.scriptId).get().then(function (doc) {
                        if (doc.exists) {
                            this.setState({premiseNode: doc.data().parentNodeId});

                            var tree = {};
                            tree[this.state.premiseNode] = this.convertFlatObjectToTree(tempTree)[this.state.premiseNode];
                            this.setState({premiseRelativeValue: tree[this.state.premiseNode]['relativeToParent']});
                            this.setState({tree: tree})

                        } else {
                            console.log("No such script");
                        }
                    }.bind(this)).catch(function (error) {
                        console.log("Error getting script:", error);
                    }.bind(this));


                }.bind(this), function (error) {
                    console.log('script-fetch-onSnapshot error:', error);
                    console.log('attempting to fetch again...');
                    if(retryCount<20) {
                        setTimeout(function () {
                            if (this.props.history.location.pathname !== '/') {
                                fetchTree.call(this, retryCount);
                            }
                        }.bind(this), 200);
                    }
                    else {
                        console.log('seems like you dont have permission. Please refresh the page and try again later');
                    }

                }.bind(this));

        }

        fetchTree.call(this, 0);
    }

    changeScope(evt) {
        console.log(evt.target.value);
        if(evt.target.value === 'private') {
            db.collection("scripts").doc(this.props.match.params.scriptId).update({scope: 'public'});
            evt.target.value = 'public';
        }
        else {
            db.collection("scripts").doc(this.props.match.params.scriptId).update({scope: 'private'});
            evt.target.value = 'private';
        }
    }

    share(evt) {
        let permissionObj = {};
        permissionObj['permission'] = 'read-only';


        //send authenticated request with read/write query with email
        //send email to firebase cloud function and check if value, if so, set the uid in the script/collaborator/write-or-readonly
        //add to users/scripts/
        //response: if no email, say invalid, if success, say success

        // let helloUserUrl = 'https://us-central1-argument-app.cloudfunctions.net/app/share';
        let helloUserUrl = 'http://localhost:5000/argument-app/us-central1/app/share';

        let id = '222@222.com';
        let type = 'email';
        let accessLevel = 'read-only';
        let params = "id=" + id + "&" + "type=" + type + "&" + "scriptId=" + this.props.match.params.scriptId + "&" + "accessLevel=" + accessLevel;

        firebase.auth().currentUser.getToken().then(function(token) {
            console.log('Sending request to', helloUserUrl + "?" + params, 'with ID token in Authorization header.');
            var req = new XMLHttpRequest();
            req.onload = function() {
                console.log('onload;', req.responseText);
            }.bind(this);
            req.onerror = function() {
                console.log('onerror;', 'error');
            }.bind(this);
            req.open('GET', helloUserUrl + "?" + params, true);
            req.setRequestHeader('Authorization', 'Bearer ' + token);
            req.send();
        }.bind(this));





        // db.collection('scripts').doc(this.props.match.params.scriptId).collection('collaborators').doc('aDJHHYlK1xMBr7np8zEDM534yG53').set(permissionObj);
        // db.collection('scripts').doc(this.props.match.params.scriptId).collection('collaborators').doc('write').update(userObj);

    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    afterOpenModal() {
        // references are now sync'd and can be accessed.
        this.subtitle.style.color = '#f00';
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }

    onShareFormSubmit() {
        
    }






    render() {
        let contentClass = this.props.isOpen ? 'content open' : 'content';
        return (
            <div>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >

                    <h2 ref={subtitle => this.subtitle = subtitle}>Hello</h2>
                    <button onClick={this.closeModal}>close</button>
                    <div>I am a modal</div>
                    <form onSubmit={this.onShareFormSubmit.bind(this)}>
                        <input />
                        <button>tab navigation</button>
                        <button>stays</button>
                        <button>inside</button>
                        <button>the modal</button>
                    </form>
                </Modal>

            <div className={contentClass}>

                <div className="EditorContainer">
                    <button onClick={this.openModal}>Open Modal</button>
                    <input id="acl" type="button" value="private" onClick={this.changeScope.bind(this)} />
                    <input id="acl" type="button" value="share" onClick={this.share.bind(this)} />
                    <div className="tree" id="tree">
                        <Node data={this.state.tree} parentNodeId={Object.keys(this.state.tree)[0]} scriptId={this.props.match.params.scriptId} premiseRelativeValue={this.state.premiseRelativeValue}/>
                    </div>
                </div>


            </div>
            </div>
        );
    }
}

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            loginEmail: '',
            loginPassword: '',
            signupEmail: '',
            signupPassword: '',
            loginError: '',
            signupError: '',
            deleteAccountError: '',
            isAuthChecked: false,
            scriptIds: []
        };
    }



    componentWillMount() {

        firebase.auth().onAuthStateChanged(function(user) {
            this.setState({isAuthChecked: true});
            if (user) {
                // User is signed in.
                let userObj = {
                    displayName: user.displayName,
                    email: user.email,
                    emailVerified: user.emailVerified,
                    photoURL: user.photoURL,
                    isAnonymous: user.isAnonymous,
                    uid: user.uid
                };

                db.collection("users").doc(user.uid).collection('scripts')
                    .onSnapshot(function(querySnapshot) {
                        let scriptIds = [];
                        querySnapshot.forEach(function(doc) {
                            scriptIds.push(doc.data().uid)
                        });
                        this.setState({scriptIds: scriptIds})

                    }.bind(this), function(error) {
                        console.log('user-fetch-scriptId-error', error);
                    });

                this.setState({user: userObj})



                // ...
            } else {
                console.log("onauth-change: user isn't signed in.");
                console.log(user);
                this.setState({user: null, scriptIds: []})
                // User is signed out.
                // ...
            }
        }.bind(this));

    }


    handleLoginEmailChange(event) {
        this.setState({loginEmail: event.target.value});
    }

    handleLoginPasswordChange(event) {
        this.setState({loginPassword: event.target.value});
    }

    handleSignupEmailChange(event) {
        this.setState({signupEmail: event.target.value});
    }

    handleSignupPasswordChange(event) {
        this.setState({signupPassword: event.target.value});
    }

    handleLoginSubmit(event) {
        this.login(this.state.loginEmail, this.state.loginPassword);
        event.preventDefault();
    }

    handleSignupSubmit(event) {
        this.signup(this.state.signupEmail, this.state.signupPassword);
        event.preventDefault();
    }


    async login(email, password) {
        const result = await auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log('auth-error:', error, errorCode);
            this.setState({loginError: errorMessage})
            // ...
        }.bind(this));

    }

    signup(email, password) {

        const result = auth().createUserWithEmailAndPassword(email, password)
            .then(function(user){
                console.log('uid',user);

                console.log('writing to users collection...');
                db.collection("users").doc(user.uid).set({
                    uid: user.uid,
                    email: user.email,
                    emailVerified: user.emailVerified,
                    photoURL: user.photoURL,
                    isAnonymous: user.isAnonymous,
                    displayName: user.displayName,
                    phoneNumber: user.phoneNumber,
                    // providerData: user.providerData
                })
                    .then(function() {
                        console.log("user added to database");
                    })
                    .catch(function(error) {
                        console.error("Error adding document: ", error);
                    });

            })
            .catch(function(error) {
            // Handle Errors here.
            let errorCode = error.code;
            let errorMessage = error.message;
            // ...
            console.log('signup-error', error, errorCode);
            this.setState({signupError: errorMessage})
        }.bind(this));

        console.log('signup:', result)

    }


    logout() {
        auth().signOut()
    }

    deleteAccount() {
        let user = firebase.auth().currentUser;

        if(user!==null) {
            user.delete().then(function () {
                // User deleted.
                console.log('user deleted')
            }.bind(this)).catch(function (error) {
                // An error happened.
                let errorCode = error.code;
                let errorMessage = error.message;
                this.setState({deleteAccountError: errorMessage})
                console.log('user-deletion-error:', error, errorCode)
            }.bind(this));
        }
    }




    render() {
        if(this.state.isAuthChecked) {
            if (this.state.user === null) {
                return (
                    <div>
                        Login
                        <form id="login" onSubmit={this.handleLoginSubmit.bind(this)}>
                            <label>
                                Email:
                                <input type="text" value={this.state.loginEmail}
                                       onChange={this.handleLoginEmailChange.bind(this)}/>
                            </label>
                            <label>
                                Password:
                                <input type="text" value={this.state.loginPassword}
                                       onChange={this.handleLoginPasswordChange.bind(this)}/>
                            </label>
                            <input type="submit" value="Submit"/>
                        </form>
                        <div>
                            {this.state.loginError}
                        </div>


                        Signup
                        <form id="signup" onSubmit={this.handleSignupSubmit.bind(this)}>
                            <label>
                                Email:
                                <input type="text" value={this.state.signupEmail}
                                       onChange={this.handleSignupEmailChange.bind(this)}/>
                            </label>
                            <label>
                                Password:
                                <input type="text" value={this.state.signupPassword}
                                       onChange={this.handleSignupPasswordChange.bind(this)}/>
                            </label>
                            <input type="submit" value="Submit"/>
                        </form>
                        <div>
                            {this.state.signupError}
                        </div>

                        Logout
                        <input id="logout" type="button" value="logout" onClick={this.logout.bind(this)}/>

                        Delete account
                        <input id="delete" type="button" value="delete" onClick={this.deleteAccount.bind(this)}/>
                        <div>
                            {this.state.deleteAccountError}
                        </div>


                    </div>
                )

            }
            else {

                return (
                    <Router>
                        <Parent user={this.state.user} scriptIds={this.state.scriptIds}/>
                    </Router>
                );
            }
        }
        else {
            return (
              <Loader/>
            );
        }
    }
}


export default App;
