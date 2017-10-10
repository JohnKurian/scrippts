import React, { Component } from 'react';
import './App.css';
import './Node.css';
import './Layout.css';


var firebase = require("firebase");

var config = {
    apiKey: "AIzaSyAg-UlKP9oonj4IMo5op6qEAOzFXHZloiY",
    authDomain: "argument-app.firebaseapp.com",
    databaseURL: "https://argument-app.firebaseio.com",
    projectId: "argument-app",
    storageBucket: "argument-app.appspot.com",
    messagingSenderId: "626987124454"
};

firebase.initializeApp(config);

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
        let tempRef = firebase.database().ref().child('test_2').push();
        let obj = {
            uid: tempRef.key,
            text: ''
        };

        //add child to parent's node children
        tempRef.set(obj);

        let childObj = {};
        childObj[tempRef.key] = true;
        firebase.database().ref().child('test_2').child(node['uid']).child('children').update(childObj)

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
                <SideBar isOpen={this.state.sidebarOpen} />
                <Content isOpen={this.state.sidebarOpen} data={this.props.data}/>
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
                <a href="javascript:;" onClick={this.props.onClick}>Click Me!</a>
                <input id="logout" type="button" value="logout" onClick={this.logout.bind(this)} />
            </header>
        );
    }
});
var SideBar = React.createClass({
    render: function() {
        var sidebarClass = this.props.isOpen ? 'sidebar open' : 'sidebar';
        return (
            <div className={sidebarClass}>
                <div>I slide into view</div>
                <div>Me too!</div>
                <div>Meee Threeeee!</div>
            </div>
        );
    }
});

var Content = React.createClass({
    render: function() {
        var contentClass = this.props.isOpen ? 'content open' : 'content';
        return (
            <div className={contentClass}>

                <div className="App">
                    <div className="tree">
                        <Node data={this.props.data}/>
                    </div>
                </div>


            </div>
        );
    }
});


class App extends Component {

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

    return tree;

}


    componentWillMount() {

        firebase.auth().onAuthStateChanged(function(user) {
            this.setState({isAuthChecked: true});
            if (user) {
                console.log('onauth-change-user:', user)
                // User is signed in.
                var displayName = user.displayName;
                var email = user.email;
                var emailVerified = user.emailVerified;
                var photoURL = user.photoURL;
                var isAnonymous = user.isAnonymous;
                var uid = user.uid;
                var providerData = user.providerData;
                this.setState({user: user})
                // ...
            } else {
                console.log("onauth-change: user isn't signed in.")
                console.log(user)
                this.setState({user: null})
                // User is signed out.
                // ...
            }
        }.bind(this));

        firebase.database().ref().child('test_2').on('value', function(snap) {
            var tree = {};
            tree[this.state.premiseNode] = this.convertFlatObjectToTree(snap.val())[this.state.premiseNode];
            console.log(tree);
            this.setState({tree: tree })
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

        const result = auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
            console.log('signup-error', error)
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
                    <Parent data={this.state.tree}/>
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
