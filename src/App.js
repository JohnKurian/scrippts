import React, { Component } from 'react';
import './App.css';
import './Node.css';
import './Layout.css';

import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'


var firebase = require("firebase");
require("firebase/firestore");


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




class Node extends Component {


    onChange = (node, evt) => {
        console.log('value:', evt.target.value)
        console.log(node)

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

    onAddClick(node, evt) {

        //attach child node to flat object

        db.collection("scripts").doc("8ZM4uG9LsQVkx1BHUHcf").collection('nodes').add({
            text: '',
            createdTime: Date.now(),
            updatedTime: Date.now()
        })
            .then(function(nodeRef) {
                console.log("Document written with ID: ", nodeRef.id);
                db.collection("scripts").doc("8ZM4uG9LsQVkx1BHUHcf").collection('nodes').doc(nodeRef.id).update({uid: nodeRef.id});

                let childObj = {};
                childObj['children.' + nodeRef.id] = true;
                db.collection("scripts").doc("8ZM4uG9LsQVkx1BHUHcf").collection('nodes').doc(node['uid']).update(childObj);

            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });

    }


    render() {

        if(this.props.data==undefined) {
            return null;
        }


        return (
            <ul>
                {

                    Object.keys(this.props.data).map(function(key, index) {

                        let node = this.props.data[key]

                        return (
                            <li>
                                    <textarea
                                        onFocus={this.onFocus.bind(this, node)}
                                        onBlur={this.onBlur.bind(this, node)}
                                        onChange={this.onChange.bind(this, node)}
                                        onClick={this.onTextAreaClick.bind(this, node)}>

                                    </textarea>
                                <button onClick={this.onAddClick.bind(this, node)} type="button">Add node</button>
                                {<Node data={node.children}/>}
                            </li>
                        )
                    }.bind(this))

                }
            </ul>
        )

    }
}



var Parent = React.createClass({
    getInitialState: function(){
        return {sidebarOpen: false};
    },
    handleViewSidebar: function(){
        this.setState({sidebarOpen: !this.state.sidebarOpen});
    },
    render: function() {
        return (
            <div>
                <Header onClick={this.handleViewSidebar} />
                <SideBar isOpen={this.state.sidebarOpen} user={this.props.user}/>
                <Editor isOpen={this.state.sidebarOpen} data={this.props.data}/>
            </div>
        );
    }
});

var Header = React.createClass({
    logout() {
        auth().signOut()
    },
    render: function() {
        return (
            <header>
                <a href="javascript:;" onClick={this.props.onClick}>Toggle</a>
                <input id="logout" type="button" value="logout" onClick={this.logout.bind(this)} />
            </header>
        );
    }
});

class SideBar extends Component{

    createNewScript() {
        console.log('writing to scripts collection...');
        console.log(this)

        db.collection("scripts").add({
            creator: this.props.user.uid,
            createdTime: Date.now(),
            updatedTime: Date.now(),
            type: 'argument',
            collaborators: [this.props.user.uid]
        })
            .then(function(scriptRef) {
                console.log("Document written with ID: ", scriptRef.id);

                db.collection('scripts').doc(scriptRef.id).set({uid: scriptRef.id}, {merge: true})

                db.collection('scripts').doc(scriptRef.id).collection('nodes').add({
                    text: ''
                })
                    .then(function (nodeRef) {
                        db.collection('scripts').doc(scriptRef.id).update({parentNodeId: nodeRef.id})
                        db.collection('scripts').doc(scriptRef.id).collection('nodes').doc(nodeRef.id).update({
                            uid: nodeRef.id,
                            text: '',
                            createdTime: Date.now(),
                            updatedTime: Date.now()
                        });

                        //get the creator id of the script
                        db.collection("scripts").doc(scriptRef.id).get().then(function(script) {
                            if (script.exists) {
                                console.log("script data:", script.data());
                                db.collection('users').doc(script.data().creator).collection('scripts').doc(scriptRef.id).set({
                                    creator: true,
                                    collaborator: true,
                                    forked: false
                                })

                            } else {
                                console.log("No such script object");
                            }
                        }).catch(function(error) {
                            console.log("Error getting document:", error);
                        });


                    })

            })
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
                <li><Link to="/">Home</Link></li>
                <input id="newScript" type="button" value="Create new script" onClick={this.createNewScript.bind(this)} />
                <input id="home" type="button" value="Home" onClick={this.goToHome.bind(this)} />
            </div>
        );
    }
}

var Editor = React.createClass({
    render: function() {
        var contentClass = this.props.isOpen ? 'content open' : 'content';
        return (
            <div className={contentClass}>

                <div className="EditorContainer">
                    <div className="tree">
                        <Node data={this.props.data}/>
                    </div>
                </div>


            </div>
        );
    }
});


class App extends Component {

    //kF73wCXA4p6OhAY74ouW

    constructor(props) {
        super(props);
        this.state = {
            tree: [],
            premiseNode: "-KlDFleO6_xjnLx88ou1",
            user: null,
            loginEmail: '',
            loginPassword: '',
            signupEmail: '',
            signupPassword: '',
            loginError: '',
            signupError: '',
            deleteAccountError: '',
            isAuthChecked: false
        };
    }




    convertFlatObjectToTree(flat) {
        console.log('flat:', flat)
        var tree = {};
        Object.keys(flat).map(function (key, index) {
            var nodeKey = key;
            var node = flat[key];

            tree[key] = node;

            var children = node['children'];

            if(children!=undefined) {
                Object.keys(children).map(function (childNodeKey, index) {

                    if (children[childNodeKey] != undefined) {
                        tree[nodeKey]['children'][childNodeKey] = flat[childNodeKey];
                    }

                });
            }

        });
        console.log('tree:', tree);
        return tree;
    }


    componentWillMount() {

        firebase.auth().onAuthStateChanged(function(user) {
            this.setState({isAuthChecked: true});
            if (user) {
                console.log('onauth-change-user:', user)
                // User is signed in.
                let userObj = {
                    displayName: user.displayName,
                    email: user.email,
                    emailVerified: user.emailVerified,
                    photoURL: user.photoURL,
                    isAnonymous: user.isAnonymous,
                    uid: user.uid
                };
                this.setState({user: userObj})


                db.collection("scripts").doc("8ZM4uG9LsQVkx1BHUHcf").collection('nodes')
                    .onSnapshot(function(querySnapshot) {
                        var cities = [];
                        var tempTree = {};
                        querySnapshot.forEach(function(doc) {
                            tempTree[doc.data().uid] = doc.data()
                        });
                        console.log('script', tempTree);

                        var tree = {};
                        tree['kF73wCXA4p6OhAY74ouW'] = this.convertFlatObjectToTree(tempTree)['kF73wCXA4p6OhAY74ouW'];
                        console.log(tree);
                        this.setState({tree: tree })
                    }.bind(this));


                // ...
            } else {
                console.log("onauth-change: user isn't signed in.");
                console.log(user);
                this.setState({user: null})
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
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log('auth-error:', error)
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
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
            console.log('signup-error', error);
            this.setState({signupError: errorMessage})
        }.bind(this));

        console.log('signup:', result)

    }


    logout() {
        auth().signOut()
    }

    deleteAccount() {
        var user = firebase.auth().currentUser;

        if(user!=null) {
            user.delete().then(function () {
                // User deleted.
                console.log('user deleted')
            }.bind(this)).catch(function (error) {
                // An error happened.
                var errorCode = error.code;
                var errorMessage = error.message;
                this.setState({deleteAccountError: errorMessage})
                console.log('user-deletion-error:', error)
            }.bind(this));
        }
    }




    render() {
        if(this.state.isAuthChecked) {
            if (this.state.user == null) {
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
                        <Parent data={this.state.tree} user={this.state.user}/>
                    </Router>
                );
            }
        }
        else {
            return (
              <div>Loading...</div>
            );
        }
    }
}






export default App;
