import React, {Component} from "react";
import "./App.css";
import "./Node.css";
import "./Layout.css";
import createBrowserHistory from "history/createBrowserHistory";

import argumentLogo from "./argument_icon.png";
import scripptLogo from './scrippt_logo_40px.png';

import shareIcon from "./share_icon.png";

import ReactDOM from "react-dom";

import {Col, Grid, Row} from "react-flexbox-grid";

import {applyMiddleware, createStore} from "redux";
import logger from "redux-logger";

import {BrowserRouter, Link, Route, Switch, withRouter, Redirect} from "react-router-dom";

import Modal from "react-modal";

import ReactTooltip from "react-tooltip";
import Toggle from 'react-toggle'

import Textarea from "react-textarea-autosize";

var firebase = require("firebase");
require("firebase/firestore");

const customStyles = {
    content : {
        top                   : '33%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    },
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255, 255, 255, 0.75)",
        zIndex: 10000
    }
};



const loginModalStyles = {
    content : {
        padding: '0px',
        top                   : '33%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    },
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255, 255, 255, 0.75)",
        zIndex: 10000
    }
};



const signupModalStyles = {
    content : {
        padding: '0px',
        top                   : '33%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    },
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255, 255, 255, 0.75)",
        zIndex: 10000
    }
};


const shareModalStyles = {
    content : {
        width: '400px',
        padding: '30px',
        top                   : '33%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    },
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255, 255, 255, 0.75)",
        zIndex: 10000
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

const history = createBrowserHistory();

firebase.initializeApp(config);

var db = firebase.firestore();
export const auth = firebase.auth;


function mainReducer(state = {activeScriptId: null, value: null, scriptFetchComplete: false, numScripts: 0, isScriptCreation: false}, action) {
    switch (action.type) {

        case 'SET_ACTIVE_SCRIPT_ID':
            return {...state, activeScriptId: action.activeScriptId};
        case 'SET_TITLE':
            return {...state, title: action.title};
        case 'SCRIPT_FETCH_COMPLETE':
            return {...state, scriptFetchComplete: true, numScripts: action.numScripts};
        case 'CREATE_SCRIPT_INITIALIZED':
            return {...state, isScriptCreation: true};
        case 'CREATE_SCRIPT_FINISHED':
            return {...state, isScriptCreation: false};
        default:
            return state
    }
}


// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
let store = createStore(mainReducer, applyMiddleware(logger));

// You can use subscribe() to update the UI in response to state changes.
// Normally you'd use a view binding library (e.g. React Redux) rather than subscribe() directly.
// However it can also be handy to persist the current state in the localStorage.

store.subscribe(() =>
    console.log(store.getState())
)


class Loader extends Component {

    render() {
        return (
            <div style={{display: 'flex', flex: 1, height: window.innerHeight, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', justifyItems: 'center'}}>
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
            text: '',
            showTools: false,
            value: 0,
            textAreaHeight: '50px',
            textAreaWidth: '275px',
            activeNode: null,
            hoveredNode: null,
            selectedNode: null
        };
    }

    componentWillMount(props) {
        this.timer = null;
    }



    onChange = (node, evt) => {
        // console.log('value:', evt.target.value)
        // console.log(node)
        this.setState({text: evt.target.value})

        clearTimeout(this.timer);

        this.setState({ value: 100 });

        this.timer = setTimeout(this.triggerChange.bind(this, node), 1000);


    }


    triggerChange(node) {

        db.collection("scripts").doc(this.props.scriptId).collection('nodes').doc(node['uid']).update({
            text: this.state.text,
            updatedTime: Date.now()
        })
    }


    onTextAreaClick(node, evt) {
        console.log('text area clicked:', node.uid);


        db.collection("scripts").doc(this.props.scriptId).collection('nodes').doc(node['uid']).update({
            textAreaWidth: evt.target.style.width,
            textAreaHeight: evt.target.style.height
        })
    }

    onNodeHoveredIn(node, evt) {
        this.setState({hoveredNode: node.uid})
    }

    onNodeHoveredOut(node, evt) {
        this.setState({hoveredNode: null})
    }



    onFocus(node, evt) {
        console.log('onFocus')
        this.setState({showTools: true, selectedNode: node.uid});
    }

    onBlur(node, evt) {
        console.log('onBlur')
        this.setState({showTools: true,  selectedNode: null})
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

    onDeleteNodeClick(node) {

        console.log(node);
        //remove children field from parent node
        // db.collection("scripts").doc(this.props.scriptId).collection('nodes').doc(node.parentUid).update({
        //     [node.uid]: firebase.firestore.FieldValue.delete()
        // }).then(function (result) {
        //     console.log(result)
        // }).catch(function (err) {
        //     console.log(err)
        // });


        db.collection("scripts").doc(this.props.scriptId).collection('nodes').doc(node.parentUid).get().then(function(doc) {
            if (doc.exists) {
                console.log("Document data:", doc.data().children);
                let children = doc.data()['children'];
                delete children[node.uid];
                console.log(children);

                db.collection("scripts").doc(this.props.scriptId).collection('nodes').doc(node.parentUid).update({
                    children: children
                }).then(function (result) {
                    console.log('update completed successfully:', result);
                }).catch(function (err) {
                    console.log(err);
                });


            } else {
                console.log("No such document!");
            }
        }.bind(this)).catch(function(error) {
            console.log("Error getting document:", error);
        });



        //delete node
        //delete all children
    }

    onNodeEnter(node, evt) {
        this.setState({hoveredNode: node.uid});
    }

    onNodeLeave(node, evt) {
        this.setState({hoveredNode: null});
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
                        let saveButton = null;

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

                        if(this.state.showTools) {
                            saveButton = (
                            <div style={{flex: 0}}>
                                <i data-tip data-for='save' onClick={this.onSaveClick.bind(this, node)} className="material-icons" style={{cursor: 'pointer', color: '#9e9e9e' }}>save</i>
                            <ReactTooltip id='save' effect='solid'>
                                <span>Save changes</span>
                            </ReactTooltip>
                            </div>
                            );
                        }

                        let width = this.state.textAreaWidth;
                        let height = this.state.textAreaHeight;
                        if(node['textAreaHeight']!==null && node['textAreaHeight']!==undefined ) {
                            height = node['textAreaHeight'];
                            width = node['textAreaWidth'];
                        }

                        let footer = (
                            <div style={{height: '24px'}}>
                            </div>
                        );

                        if(this.state.hoveredNode === node.uid) {
                            footer = (
                                <div onMouseEnter={this.onNodeHoveredIn.bind(this, node)} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>

                                    <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                        <i data-tip='custom show' data-event='click focus' onClick={()=>{console.log('im in here')}} className="material-icons" style={{ cursor: 'pointer', color: '#9e9e9e' }}>add_circle</i>
                                        <ReactTooltip globalEventOff='click' place="bottom" />

                                        <button style={{  background: labelColorMap[-1*currentNodeValue], cursor: 'pointer', borderColor: labelColorMap[-1*currentNodeValue], color: '#fff', borderRadius: '10px', outline: '0', margin: '2px'}} onClick={this.onAddClick.bind(this, node, "but")} type="button">but</button>
                                        <button style={{  background: labelColorMap[currentNodeValue], cursor: 'pointer', borderColor: labelColorMap[currentNodeValue], color: '#fff', borderRadius: '10px', outline: '0', margin: '2px'}} onClick={this.onAddClick.bind(this, node, "because")} type="button">because</button>
                                    </div>
                                    { !(node.uid === this.props.parentNodeId) &&
                                        <a style={{display: 'flex', justifyContent: 'flex-end', border: '0px', padding: '0px' }} href="javascript:;" onClick={this.onDeleteNodeClick.bind(this, node)}>
                                        <i className="material-icons" style={{textDecoration: 'none', color: 'rgb(117, 117, 117)', fontSize: '21px'}}>delete_forever</i>
                                        </a>
                                    }

                                </div>
                            );
                        }


                        return (
                            <li key={node.uid}>
                                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                    {/*<div className="circle"></div>*/}
                                    <div onMouseEnter={this.onNodeEnter.bind(this, node)} onMouseLeave={this.onNodeLeave.bind(this, node)} style={{
                                        background: 'white',
                                        paddingLeft: '10px',
                                        paddingRight: '10px',
                                        paddingTop: '10px',
                                        paddingBottom: '3px',
                                        borderRadius: '6px',
                                        boxShadow: '1px 1px 4px rgba(0,0,0,.3)',
                                        zIndex: '100'
                                    }}>
                                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                            <div style={{flex: 1}}>
                                            {nodeHeader}
                                            </div>
                                            {/*{saveButton}*/}

                                        </div>

                                        <Textarea
                                            id={node.uid}
                                            key={node.text}
                                            style={{resize: 'none', width: '300px', background: color}}
                                            autoFocus={true}
                                            defaultValue={node.text}
                                            onFocus={this.onFocus.bind(this, node)}
                                            onBlur={this.onBlur.bind(this, node)}
                                            onChange={this.onChange.bind(this, node)}
                                            onClick={this.onTextAreaClick.bind(this, node)}
                                        />

                                        {footer}

                                    </div>
                                </div>
                                {(node.children!==undefined && Object.keys(node.children).length > 0) &&
                                <Node data={node.children} parentNodeId={this.props.parentNodeId} scriptId={this.props.scriptId} premiseRelativeValue={currentNodeValue}/>}
                            </li>
                        )
                    }.bind(this))

                }
            </ul>
        )

    }
}

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showConfirmDeletion: false,
            deletionConfirmPassword: '',
            showChangePassword: false,
            oldPassword: '',
            newPassword: '',
        };
    }

    componentDidMount() {
        document.title = 'Profile';
        store.dispatch({type: 'SET_ACTIVE_SCRIPT_ID', activeScriptId: null})
    }

    onDeleteAccountSubmit() {
        this.setState({showConfirmDeletion: true});
        console.log('delete account clicked');
    }

    onCancelDeletionClick() {
        this.setState({showConfirmDeletion: false, deletionConfirmPassword: ''})
    }

    onConfirmDeletionClick() {

        var user = firebase.auth().currentUser;
        const credential = firebase.auth.EmailAuthProvider.credential(
            this.props.user.email,
            this.state.deletionConfirmPassword
        );

// Prompt the user to re-provide their sign-in credentials

        user.reauthenticateWithCredential(credential).then(function() {
            console.log('user is re-authenticated');
            // User re-authenticated.

                db.collection("users").doc(this.props.user.uid).delete().then(function() {
                    console.log("user document deleted!");

                    user.delete().then(function() {
                        console.log('user deleted successfully.');
                        this.props.history.push('/');
                        window.location.reload();
                    }.bind(this)).catch(function(error) {
                    // An error happened.
                    });

                }.bind(this)).catch(function(error) {
                    console.error("Error removing user document: ", error);
                });

                // User deleted.

        }.bind(this)).catch(function(error) {
            console.log('error:', error)
            // An error happened.
        });


    }

    handleDeletionConfirmPasswordChange(evt) {
        this.setState({deletionConfirmPassword: evt.target.value })
    }

    onPasswordChangeClick() {
        this.setState({showChangePassword: true})
    }

    handleOldPasswordChange(evt) {
        this.setState({oldPassword: evt.target.value })
    }

    handleNewPasswordChange(evt) {
        this.setState({newPassword: evt.target.value })
    }

    onConfirmPasswordChangeClick() {

        var user = firebase.auth().currentUser;
        const credential = firebase.auth.EmailAuthProvider.credential(
            this.props.user.email,
            this.state.oldPassword
        );

// Prompt the user to re-provide their sign-in credentials

        user.reauthenticateWithCredential(credential).then(function() {
            console.log('user is re-authenticated');
            user.updatePassword(this.state.newPassword).then(function() {
                console.log('password update successful');
                // Update successful.
            }).catch(function(error) {
                // An error happened.
            });            // User re-authenticated.
        }.bind(this)).catch(function(error) {
            console.log('error:', error)
            // An error happened.
        });

    }

    onCancelPasswordChangeClick() {
        this.setState({showChangePassword: false, oldPassword: '', newPassword: ''})
    }


    render() {


        return (
            <div style={{marginTop: '100px'}}>
                profile
                <div>
                    email: {this.props.user.email}
                </div>

                <div>
                    username: {this.props.user.username}
                </div>

                <div>
                    password:
                    <button onClick={this.onPasswordChangeClick.bind(this)} style={{width: '50px', fontSize: '14px', height: '30px', background: 'red', borderColor: 'transparent', color: '#fff',cursor: 'pointer' }} type="button" value="Submit">change</button>

                </div>
                {this.state.showChangePassword &&
                    <div>
                        <input style={{width: '200px', height: '25px', fontSize: '14px'}} type="password" placeholder="enter old password" value={this.state.oldPassword}
                               onChange={this.handleOldPasswordChange.bind(this)}/>
                        <input style={{width: '200px', height: '25px', fontSize: '14px'}} type="password" placeholder="enter new password" value={this.state.newPassword}
                               onChange={this.handleNewPasswordChange.bind(this)}/>

                        <button onClick={this.onConfirmPasswordChangeClick.bind(this)}>Confirm</button>
                        <button onClick={this.onCancelPasswordChangeClick.bind(this)}>Cancel</button>
                    </div>
                }

                <button onClick={this.onDeleteAccountSubmit.bind(this)} style={{width: '50px', fontSize: '14px', height: '30px', background: 'red', borderColor: 'transparent', color: '#fff',cursor: 'pointer' }} type="button" value="Submit">delete</button>
                {this.state.showConfirmDeletion &&
                    <div>
                        sure you wanna delete?
                        <input style={{width: '200px', height: '25px', fontSize: '14px'}} type="password" placeholder="enter password" value={this.state.deletionConfirmPassword}
                               onChange={this.handleDeletionConfirmPasswordChange.bind(this)}/>
                        <button onClick={this.onConfirmDeletionClick.bind(this)}>Confirm</button>
                        <button onClick={this.onCancelDeletionClick.bind(this)}>Cancel</button>
                    </div>

                }
            </div>
        )
    }


}



class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
        document.title = 'Home';
        store.dispatch({type: 'SET_ACTIVE_SCRIPT_ID', activeScriptId: null})

    }

    createNewScript() {
        console.log('writing to scripts collection...');

        store.dispatch({type: 'CREATE_SCRIPT_INITIALIZED', isScriptCreation: true});

        db.collection("scripts").add({
            creator: this.props.user.uid,
            scope: 'private',
            createdTime: Date.now(),
            updatedTime: Date.now(),
            type: 'argument',
            title: 'Untitled',
            collaborators: [this.props.user.uid]
        })
            .then(function(scriptRef) {
                console.log("Document written with ID: ", scriptRef.id);

                db.collection('scripts').doc(scriptRef.id).update({uid: scriptRef.id});

                let permissionObj = {};
                permissionObj['permission'] = 'write';
                permissionObj['uid'] = this.props.user.uid;
                permissionObj['email'] =  this.props.user.email;
                permissionObj['isOwner'] = true;

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
                            uid: scriptRef.id,
                            title: 'Untitled'
                        });

                        store.dispatch({type: 'CREATE_SCRIPT_FINISHED', isScriptCreation: false});
                        this.props.history.push('/s/' + scriptRef.id);
                        window.location.reload();


                    }.bind(this))

            }.bind(this))
            .catch(function(error) {
                store.dispatch({type: 'CREATE_SCRIPT_FINISHED', isScriptCreation: false});
                console.error("Error adding document: ", error);
            });
    }


    deleteScript(userId, scriptId, evt) {
        evt.preventDefault();
        console.log('im in here');
        db.collection("scripts").doc(scriptId).delete().then(function() {
            console.log("Document successfully deleted from /scripts");

            db.collection("users").doc(userId).collection('scripts').doc(scriptId).delete().then(function() {
                console.log("Document successfully deleted from /users/scripts");
            }).catch(function(error) {
                console.error("Error removing document from /users/scripts: ", error);
            });


        }).catch(function(error) {
            console.error("Error removing document from /scripts: ", error);
        });
    }

    timeSince(date) {

        var seconds = Math.floor((new Date() - date) / 1000);

        var interval = Math.floor(seconds / 31536000);

        if (interval > 1) {
            return interval + " years";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return interval + " months";
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + " days";
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + " hours";
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + " minutes";
        }
        return Math.floor(seconds) + " seconds";
    }

    onMouseEnterScript() {

    }

    onMouseLeaveScript() {

    }


    render() {

        const SCRIPT_ROUTE = (scriptId) => `/s/${scriptId}/`;

        let scriptHeaderFragment = (<div></div>);

        let initFragment = (
            <Col xs={12} sm={3} md={2} lg={1}  style={{marginBottom: '80px', marginLeft: '80px', marginRight: '80px'}}>
                {/*<Link activeStyle={{}} to={SCRIPT_ROUTE(this.props.scriptHeaders[key].uid)} style={{textDecoration: 'none'}} params={{scriptId: this.props.scriptHeaders[key].uid}}>*/}
                    <div onClick={this.createNewScript.bind(this)} style={{cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems:"center",justifyContent:"center", width: 200, height: 225, background: 'white', boxShadow: '1px 1px 4px rgba(0,0,0,.3)'}} key={123}>
                        <i className="material-icons" style={{textDecoration: 'none', color: '#1976d2', fontSize: '100px'}}>add</i>
                        <div style={{color: '#555555', fontSize: '20px', marginTop: '20px'}}>
                        Create new script
                        </div>
                        {/*{this.props.scriptHeaders[id]['uid']}*/}
                        {/*{this.props.scriptHeaders[key].title}*/}
                        {/*<a href="javascript:;" onClick={this.deleteScript.bind(this, this.props.user.uid, this.props.scriptHeaders[key].uid)}>*/}
                            {/*<i className="material-icons" style={{textDecoration: 'none', color: 'rgb(117, 117, 117)', fontSize: '20px'}}>delete_forever</i>*/}
                        {/*</a>*/}
                        <br/>
                    </div>
                {/*</Link>*/}
            </Col>
        );

        if(!store.getState().scriptFetchComplete || store.getState().numScripts>0) {
            initFragment = null;
        }




        if(this.props.scriptHeaders!==undefined) {

            if(Object.keys(this.props.scriptHeaders).length>0) {
                initFragment = null;
            }

            scriptHeaderFragment = (Object.keys(this.props.scriptHeaders).map(function(key) {
                // console.log("here", this.props.scriptHeaders.toString());
                return (
                    <Col xs={12} sm={3} md={2} lg={1}  style={{marginBottom: '80px', marginLeft: '80px', marginRight: '80px'}}>
                        <Link activeStyle={{}} to={SCRIPT_ROUTE(this.props.scriptHeaders[key].uid)} style={{textDecoration: 'none'}} params={{scriptId: this.props.scriptHeaders[key].uid}}>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems:"center",justifyContent:"center", width: 200, height: 225, background: 'white', boxShadow: '1px 1px 4px rgba(0,0,0,.3)'}} key={this.props.scriptHeaders[key].uid}>
                                <div style={{display: 'flex', flex: 3,width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                                    <div>
                                    <img style={{width: 80, height: 80}} src={argumentLogo}></img>
                                    </div>
                                </div>
                                {/*{this.props.scriptHeaders[id]['uid']}*/}

                                <div style={{display: 'flex', flex: 1, flexDirection: 'row', width: '100%'}}>
                                    <div style={{display: 'flex', flexDirection: 'column', flex: 5, marginLeft: '15px'}}>
                                        <div style={{marginBottom: '4px', width: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '15px', fontWeight: '600', color: '#373737'}}>
                                        {this.props.scriptHeaders[key].title}
                                        </div>
                                        <div style={{display: 'flex', flexDirection: 'row'}}>
                                            <img style={{width: 20, height: 20, marginRight: '3px'}} src={argumentLogo}></img>
                                            <div style={{fontSize: '10.5px', fontWeight: '300', color: '#373737'}}>
                                                updated {this.timeSince(this.props.scriptHeaders[key].updatedTime)} ago
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{flex: 1, alignSelf: 'center'}}>
                                        <a href="javascript:;" onClick={this.deleteScript.bind(this, this.props.user.uid, this.props.scriptHeaders[key].uid)}>
                                            <i className="material-icons" style={{textDecoration: 'none', color: 'rgb(117, 117, 117)', fontSize: '20px'}}>delete_forever</i>
                                        </a>
                                    </div>
                                    <br/>
                                </div>
                            </div>
                        </Link>
                    </Col>
                )
            }.bind(this)))

        }

        return (
            <div>
                <div style={{marginTop: '100px', paddingLeft: '100px', paddingRight: '100px'}}>
                    <Grid fluid>
                        <Row start="xs">
                            {initFragment}{scriptHeaderFragment}
                        </Row>
                    </Grid>
                </div>
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
        this.setState({sidebarOpen: true});
    }

    disableSidebar(){
        this.setState({sidebarOpen: false});
    }

    render() {
        return (
            <div>

                <Route render={(props) => ( <Header {...props }user={this.props.user} onClick={this.handleViewSidebar.bind(this)} /> )} />

                <Route render={(props) => ( this.props.user ? <SideBar {...props} isOpen={this.state.sidebarOpen} disableSidebar={this.disableSidebar.bind(this)} user={this.props.user}/> : null)}/>

                <Switch>
                    <Route exact path="/s/:scriptId" render={(props) => (
                        <Editor
                            {...props}
                            disableSidebar={this.disableSidebar.bind(this)}
                            isOpen={this.state.sidebarOpen}/>
                    )} />
                    <Route exact path="/" render={(props) => ( this.props.user ? <Home {...props} user={this.props.user} scriptIds={this.props.scriptIds} scriptHeaders={this.props.scriptHeaders}/> : <Redirect to="/" />)}/>
                    <Route exact path="/profile" render={(props) => ( this.props.user ? <Profile {...props} user={this.props.user} /> : <Redirect to="/" />)}/>
                </Switch>
            </div>
        );
    }
}

const LogoutButton = withRouter(({ history }) => (

    <div style={{display: 'flex', paddingLeft: '50px', height: '40px', alignItems: 'center'}}>
        <i className="material-icons" style={{textDecoration: 'none', color: 'rgb(117, 117, 117)', fontSize: '32px'}}>power_settings_new</i>
        <Link to="/" style={{ color: '#555555', textDecoration: 'none', fontSize: '17px', paddingLeft: '5px' }} onClick={() => {
            auth().signOut();
            history.push('/');
            window.location.reload();
        }}>Logout</Link>
    </div>
    )
);

class ForgotPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: ''
        };
    }

    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    send() {
        console.log('im in here')
        var auth = firebase.auth();

        auth.sendPasswordResetEmail(this.state.email).then(function() {
            console.log('email sent')
            // Email sent.
        }.bind(this)).catch(function(error) {
            // An error happened.
        });
    }

    handleEmailChange(evt) {
        this.setState({email: evt.target.value});

        if(!this.validateEmail(evt.target.value)) {
            evt.target.setCustomValidity("email isn't valid")
        } else {
            evt.target.setCustomValidity("")
        }
    }

    handleSubmit() {

    }

    close() {

    }

    render() {
        return (
            <div>
                <div>Password reset</div>
                <div>Please enter your email. We will send you an email to reset your password.</div>
                <input style={{width: '100px', fontSize: '14px'}} type="email" placeholder="email" required value={this.state.email}
                       onChange={this.handleEmailChange.bind(this)}/>
                <button onClick={this.send.bind(this)}>send</button>
                <button onClick={this.props.closeModal}>close</button>
            </div>
        )
    }
}

class Header extends Component{


    constructor(props) {
        super(props);
        this.state = {
            tree: {},
            premiseNode: "",
            premiseRelativeValue: 1,
            centerLock: true,
            modalIsOpen: false,
            loaderModalIsOpen: false,
            loginModalIsOpen: false,
            signupModalIsOpen: false,
            activeScriptId: null,
            title: '',
            collaborators: {},
            shareUsernameField: '',
            permissionValue: 'read-only',
            shareModalMessage: '',
            timer: null,
            forgotPasswordModalIsOpen: false
        };

        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

        this.openLoaderModal = this.openLoaderModal.bind(this);
        this.afterOpenLoaderModal = this.afterOpenLoaderModal.bind(this);
        this.closeLoaderModal = this.closeLoaderModal.bind(this);
    }

    componentDidMount() {
        store.subscribe(() => {
            console.log('inside header:', store.getState());
            this.setState({activeScriptId: store.getState().activeScriptId, title: store.getState().title, loaderModalIsOpen: store.getState().isScriptCreation})

            if(store.getState().activeScriptId) {

                db.collection('scripts').doc(store.getState().activeScriptId).collection('collaborators').onSnapshot(function (querySnapshot) {
                        querySnapshot.forEach(function (doc) {
                            console.log(doc.id, " => ", doc.data());
                            let collaborators = this.state.collaborators;
                            collaborators[doc.id] = doc.data();
                            this.setState({collaborators: collaborators})
                        }.bind(this));
                    }.bind(this));

                db.collection('scripts').doc(store.getState().activeScriptId).onSnapshot(function (doc) {
                    console.log('script change: ', doc.data());
                    this.setState({scope: doc.data().scope})
                }.bind(this))

                }
            }
        )
    }

    componentWillMount(props) {
        this.timer = null;
    }

    componentWillReceiveProps(props) {
        if(props.user) {
            this.setState({loginModalIsOpen: false, signupModalIsOpen: false});
        }
    }



    onFocus(node) {

    }

    onBlur(node) {

    }

    onChange(node) {

    }

    onTextAreaClick(node) {

    }



    openModal() {
        this.setState({modalIsOpen: true});
    }

    afterOpenModal() {
        // references are now sync'd and can be accessed.
        this.subtitle.style.color = 'black';
    }

    closeModal() {
        this.setState({modalIsOpen: false, shareModalMessage: '', shareUsernameField: ''});
    }



    openLoaderModal() {
        this.setState({loaderModalIsOpen: true});
    }

    afterOpenLoaderModal() {

    }

    closeLoaderModal() {

    }


    openLoginModal() {
        this.setState({loginModalIsOpen: true});
    }

    afterOpenLoginModal() {

    }

    closeLoginModal() {
        this.setState({loginModalIsOpen: false});
    }



    openSignupModal() {
        this.setState({signupModalIsOpen: true});
    }

    afterOpenSignupModal() {

    }

    closeSignupModal() {
        this.setState({signupModalIsOpen: false});
    }


    openForgotPasswordModal() {
        this.setState({forgotPasswordModalIsOpen: true, loginModalIsOpen: false})
    }


    closeForgotPasswordModal() {
        this.setState({forgotPasswordModalIsOpen: false})
    }




    validateUsername(username) {
        let regexValidator = /^[a-zA-Z0-9]+([_-]?[a-zA-Z0-9])*$/;
        return regexValidator.test(username);
    }


    onShareFormSubmit(evt) {
        evt.preventDefault();
        if(this.validateUsername(this.state.shareUsernameField)) {
            this.share(this.state.shareUsernameField, this.state.permissionValue, this.state.activeScriptId);
        }
        else {
            this.setState({shareModalMessage: 'invalid email id format'})
        }
    }

    handleShareModalUsernameInputChange(event) {
        this.setState({shareUsernameField: event.target.value});
        if(event.target.value.length===0 || this.validateUsername(event.target.value)) {
            this.setState({shareModalMessage: ''});
        }
    }

    handlePermissionChange(event) {
        this.setState({permissionValue: event.target.value});
    }

    share(username, permission, activeScriptId) {
        let permissionObj = {};
        permissionObj['permission'] = permission;

        // let helloUserUrl = 'https://us-central1-argument-app.cloudfunctions.net/app/share';
        let helloUserUrl = 'http://localhost:5000/argument-app/us-central1/app/addCollaborator';

        let id = username;
        let type = 'username';
        let params = "id=" + id + "&" + "type=" + type + "&" + "scriptId=" + activeScriptId + "&" + "accessLevel=" + permission;

        firebase.auth().currentUser.getToken().then(function(token) {
            console.log('Sending request to', helloUserUrl + "?" + params, 'with ID token in Authorization header.');
            var req = new XMLHttpRequest();
            req.onload = function() {
                console.log('onload;', req.responseText);
                this.setState({shareModalMessage: JSON.parse(req.responseText).msg})
            }.bind(this);
            req.onerror = function() {
                console.log('onerror;', 'error');
            }.bind(this);
            req.open('GET', helloUserUrl + "?" + params, true);
            req.setRequestHeader('Authorization', 'Bearer ' + token);
            req.send();
        }.bind(this));


    }

    onTitleHitEnter(evt) {
        var keycode = evt.charCode || evt.keyCode;
        if (keycode  === 13) { //Enter key's keycode
            console.log('im in here');
            evt.preventDefault();
        }
    }

    onChange = (evt) => {
        // console.log('value:', evt.target.value)
        // console.log(node)
        this.setState({text: evt.target.value})
        console.log('evt:', evt.target.value)

        clearTimeout(this.timer);

        this.setState({ value: 100 });

        this.timer = setTimeout(this.triggerChange.bind(this), 1000);


    }


    triggerChange() {
        console.log('inside trigger change')

        let domNode = ReactDOM.findDOMNode(this.refs.title);
        console.log(domNode)
        console.log(domNode.innerText);

        if(domNode.innerText.length>0) {
            this.setState({title: domNode.innerText});
            db.collection('scripts').doc(this.state.activeScriptId).update({title: domNode.innerText});
            db.collection('users').doc(this.props.user.uid).collection('scripts').doc(this.state.activeScriptId).update({title: domNode.innerText});
            store.dispatch({type: 'SET_TITLE', title: domNode.innerText});
            document.title = domNode.innerText;
        }
        else {
            this.setState({title: 'Untitled'});
            db.collection('scripts').doc(this.state.activeScriptId).update({title: 'Untitled'});
            db.collection('users').doc(this.props.user.uid).collection('scripts').doc(this.state.activeScriptId).update({title: 'Untitled'});
            store.dispatch({type: 'SET_TITLE', title: 'Untitled'});
            document.title = 'Untitled';
        }
    }

    onTitleChange(evt) {
        let domNode = ReactDOM.findDOMNode(this.refs.title);
        console.log(domNode)
        console.log(domNode.innerText);

        if(domNode.innerText.length>0) {
            this.setState({title: domNode.innerText});
            db.collection('scripts').doc(this.state.activeScriptId).update({title: domNode.innerText});
            db.collection('users').doc(this.props.user.uid).collection('scripts').doc(this.state.activeScriptId).update({title: domNode.innerText});
        }
        else {
            this.setState({title: 'Untitled'});
            db.collection('scripts').doc(this.state.activeScriptId).update({title: 'Untitled'});
            db.collection('users').doc(this.props.user.uid).collection('scripts').doc(this.state.activeScriptId).update({title: 'Untitled'});
        }
    }


    removePartner(userId, scriptId) {

        // let helloUserUrl = 'https://us-central1-argument-app.cloudfunctions.net/app/share';
        let helloUserUrl = 'http://localhost:5000/argument-app/us-central1/app/removeCollaborator';

        let params = "userId=" + userId + "&" + "scriptId=" + scriptId;

        firebase.auth().currentUser.getToken().then(function(token) {
            console.log('Sending request to', helloUserUrl + "?" + params, 'with ID token in Authorization header.');
            var req = new XMLHttpRequest();
            req.onload = function() {
                console.log('onload;', req.responseText);
                this.setState({shareModalMessage: JSON.parse(req.responseText).msg})
            }.bind(this);
            req.onerror = function() {
                console.log('onerror;', 'error');
            }.bind(this);
            req.open('GET', helloUserUrl + "?" + params, true);
            req.setRequestHeader('Authorization', 'Bearer ' + token);
            req.send();
        }.bind(this));


    }

    removeCollaborator(key) {

        db.collection('scripts').doc(this.state.activeScriptId).collection('collaborators').doc(key).delete().then(function() {

            let newCollabObj = Object.keys(this.state.collaborators)
                .filter( objKey => objKey !== key)
                .reduce((obj, objKey) => {
                    obj[objKey] = this.state.collaborators[objKey];
                    return obj;
                }, {});

            this.removePartner(key, this.state.activeScriptId);

            this.setState({collaborators: newCollabObj});

        }.bind(this)).catch(function(error) {
            console.error("Error removing document: ", error);
        });

    }

    handleShareSettingsPermissionChange(key, evt) {
        let obj = this.state.collaborators;
        obj[key]['permission'] = evt.target.value;
        this.setState({obj});
        db.collection('scripts').doc(this.state.activeScriptId).collection('collaborators').doc(key).update({permission: evt.target.value})
    }

    handleScopeChange() {
        let newScope = this.state.scope === 'public'? 'private': 'public';
        db.collection('scripts').doc(this.state.activeScriptId).update({scope: newScope}).then(function(obj) {
            this.setState({scope: newScope});
        }.bind(this));
    }

    onLogoClick() {
        this.props.history.push('/');
    }

    render() {

        const loaderStyles = {
            content : {
                top                   : '33%',
                left                  : '50%',
                right                 : 'auto',
                bottom                : 'auto',
                marginRight           : '-50%',
                transform             : 'translate(-50%, -50%)',
                border: '0px',
                backgroundColor: "rgba(255, 255, 255, 0)",
                background: "rgba(255, 255, 255, 0)",
            },
            overlay: {
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(255, 255, 255, 0.75)",
                background: "rgba(255, 255, 255, 0.75)",
                border: '0px',
                zIndex: 20000
            }
        };

        let permissionObj = {
            'read-only': 'can view',
            'write': 'can edit'
        };

        let collaborators = null;
        let headerSubSection = null;

        let shareModalMessage = (<br/>);
        if(this.state.shareModalMessage.length>0) {
            shareModalMessage = this.state.shareModalMessage;
        }

        if(this.props.user) {


            collaborators = (Object.keys(this.state.collaborators).map(function(key) {
                return (
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div style={{flex: 1, fontSize: '15px'}}>
                            {this.state.collaborators[key]['username']}
                        </div>


                        {    (this.state.collaborators && this.state.collaborators[this.props.user.uid]) &&
                        <div style={{flex: 1}}>
                            {
                                this.state.collaborators[key]['isOwner'] ?
                                    'is owner' :
                                    this.state.collaborators[this.props.user.uid]['isOwner'] ?
                                        (<select style={{margin: '5px'}} name="permission"
                                                 value={this.state.collaborators[key]['permission']}
                                                 onChange={this.handleShareSettingsPermissionChange.bind(this, key)}>
                                            <option value="read-only">can view</option>
                                            <option value="write">can edit</option>
                                        </select>) : permissionObj[this.state.collaborators[key]['permission']]
                            }
                        </div>
                        }

                        {   (this.state.collaborators && this.state.collaborators[this.props.user.uid]) &&
                        (this.state.collaborators[this.props.user.uid]['isOwner'] &&  key !== this.props.user.uid) ||
                        (key === this.props.user.uid && !this.state.collaborators[this.props.user.uid]['isOwner'])
                            ?
                            <div style={{}}>
                                <a href="javascript:;" onClick={this.removeCollaborator.bind(this, key)}
                                   title="remove collaborator">
                                    <i className="material-icons"
                                       style={{textDecoration: 'none', color: 'rgb(117, 117, 117)', fontSize: '20px'}}>remove_circle</i>
                                </a>
                            </div> : <div style={{width: '20px'}}></div>
                        }


                    </div>
                );
            }.bind(this)));


            headerSubSection = (
                <div style={{display: 'flex', flex: 1, flexDirection: 'row',  alignItems: 'center', justifyContent: 'center'}}>

                    <div style={{display: 'flex', flex: 1,  alignItems: 'center', justifyContent: 'center'}}>
                        <span suppressContentEditableWarning={true} ref="title" onInput={this.onChange.bind(this)} onKeyPress={this.onTitleHitEnter.bind(this)} contentEditable="true" style={{padding: '5px', minWidth: '50px', maxWidth: '500px', fontSize: '18px', overflow: 'hidden', whiteSpace: 'nowrap'}}>{this.state.title}</span>
                    </div>

                    <div style={{flex: 0, marginRight: '32px'}}>
                        <Modal
                            isOpen={this.state.modalIsOpen}
                            onAfterOpen={this.afterOpenModal}
                            onRequestClose={this.closeModal}
                            style={shareModalStyles}
                            contentLabel="Example Modal"
                        >
                            <div style={{display: 'flex', flex: 1, flexDirection: 'row', marginBottom: '40px'}}>
                                <h3 ref={subtitle => this.subtitle = subtitle} style={{flex: 1, margin: 0, color: 'black'}}>Share settings</h3>
                                <a href="javascript:;" onClick={this.closeModal}>
                                    <i className="material-icons" style={{textDecoration: 'none', color: 'rgb(117, 117, 117)', fontSize: '20px'}}>close</i>
                                </a>
                            </div>

                            <div style={{marginBottom: '30px', display: 'flex', flexDirection: 'row'}}>
                                <h4 style={{margin: 0, color: 'black'}}>Link Sharing</h4>
                                <label style={{display: 'flex', marginLeft: '10px'}}>
                                    { (this.props.user && this.state.collaborators && this.state.collaborators[this.props.user.uid]) &&
                                    <Toggle style={{width: '2px'}}
                                            defaultChecked={this.state.scope === 'public'}
                                            disabled={!this.state.collaborators[this.props.user.uid]['isOwner']}
                                            onChange={this.handleScopeChange.bind(this)}/>
                                    }
                                    <span style={{marginLeft: '5px'}}>
                                    {this.state.scope === 'public'? ' anyone with the link can view' : 'only specific people can view'}
                                </span>
                                </label>
                            </div>

                            <div style={{marginBottom: '30px'}}>
                                <h4 style={{margin: 0, color: 'black', marginBottom: '5px'}}>Collaborators</h4>
                                <div>
                                    {collaborators}
                                </div>
                            </div>

                            {   (this.props.user && this.state.collaborators && this.state.collaborators[this.props.user.uid]) ?

                                this.state.collaborators[this.props.user.uid]['isOwner'] &&
                                <div >
                                    <div>Add a collaborator</div>
                                    <form onSubmit={this.onShareFormSubmit.bind(this)}>
                                        <input style={{margin: '5px', width: '200px'}} type="text"
                                               value={this.state.shareUsernameField}
                                               placeholder="enter username"
                                               onChange={this.handleShareModalUsernameInputChange.bind(this)}/>
                                        <select style={{margin: '5px'}} name="permission" value={this.state.permissionValue}
                                                onChange={this.handlePermissionChange.bind(this)}>
                                            <option value="read-only">can view</option>
                                            <option value="write">can edit</option>
                                        </select>
                                        <button style={{margin: '5px'}}>add</button>

                                    </form>
                                    <div>{shareModalMessage}</div>
                                </div> : ''

                            }

                        </Modal>

                        <div onClick={this.openModal} style={{padding: '8px', borderRadius: '2px', borderColor: '#1565c0', display: 'flex', flex: 1, alignItems: 'center', background: '#1565c0', color: 'white',  cursor: 'pointer', flexDirection: 'row'}}>
                            <img style={{flex: 1, width: 12, height: 12}} src={shareIcon}></img>
                            <div style={{flex: 1, paddingLeft: '5px', paddingRight: '5px', fontSize: '12px'}}>Share</div>
                        </div>
                    </div>

                </div>
            );







        }


        if(store.getState().activeScriptId===null) {
            headerSubSection = (
                <div style={{flex: 1}}>

                </div>
            );
        }
        return (
            <header style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center'}}>
                { this.props.user ?
                    (
                        <div style={{marginLeft: '24px'}}>
                        <a href="javascript:;" onClick={this.props.onClick}>
                            <i className="material-icons"
                               style={{textDecoration: 'none', color: 'rgb(117, 117, 117)', fontSize: '28px'}}>menu</i>
                        </a>
                    </div>
                    )
                    :
                    (
                        <div onClick={this.onLogoClick.bind(this)} style={{marginTop: '15px', cursor: 'pointer', marginBottom: '24px', height: '64px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <img style={{width: 30, height: 30, padding: '5px'}} src={scripptLogo}></img>
                            <div style={{opacity: '.55', fontSize: '20px'}}>
                                Scrippt
                            </div>
                            <sup style={{opacity: 0.5}}> beta</sup>
                        </div>
                    )
                }


                <Modal
                    isOpen={this.state.loaderModalIsOpen}
                    style={loaderStyles}
                    contentLabel="Loader Modal"
                >
                    <Loader/>
                </Modal>

                <Modal
                    isOpen={this.state.loginModalIsOpen}
                    onRequestClose={this.closeLoginModal.bind(this)}
                    style={loginModalStyles}
                    contentLabel="Loader Modal"
                >
                    <Login openForgotPasswordModal={this.openForgotPasswordModal.bind(this)} closeLoginModal={this.closeLoginModal.bind(this)}/>
                </Modal>

                <Modal
                    isOpen={this.state.signupModalIsOpen}
                    onRequestClose={this.closeSignupModal.bind(this)}
                    style={signupModalStyles}
                    contentLabel="Loader Modal"
                >
                    <Signup closeSignupModal={this.closeSignupModal.bind(this)}/>
                </Modal>

                <Modal
                    isOpen={this.state.forgotPasswordModalIsOpen}
                    onRequestClose={this.closeForgotPasswordModal.bind(this)}
                    style={signupModalStyles}
                    contentLabel="Loader Modal"
                >
                    <ForgotPassword closeModal={this.closeForgotPasswordModal.bind(this)}/>
                </Modal>


                {   this.props.user ?
                    headerSubSection :
                    (
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <div onClick={this.openLoginModal.bind(this)} style={{padding: '8px', margin: '5px', borderRadius: '2px', borderColor: '#1565c0', display: 'flex', flex: 1, alignItems: 'center', background: '#1565c0', color: 'white',  cursor: 'pointer', flexDirection: 'row'}}>
                            <div style={{ paddingLeft: '5px', paddingRight: '5px', fontSize: '12px'}}>Login</div>
                            </div>

                            <div onClick={this.openSignupModal.bind(this)} style={{padding: '8px', margin: '5px', marginRight: '30px', borderRadius: '2px', borderColor: '#1565c0', display: 'flex', flex: 1, alignItems: 'center', background: '#1565c0', color: 'white',  cursor: 'pointer', flexDirection: 'row'}}>
                            <div style={{ paddingLeft: '5px', paddingRight: '5px', fontSize: '12px'}}>Signup</div>
                            </div>
                        </div>
                    )
                }
            </header>
        );
    }
}

class SideBar extends Component{

    constructor(props, context) {
        super(props, context);

        this.state = {
            isOpen: false,
            isInternalLinkClicked: false
        };

        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    /**
     * Set the wrapper ref
     */
    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    /**
     * Alert if clicked on outside of element
     */
    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target) && this.props.isOpen) {
            this.setState({isOpen: false});
        }
    }

    componentWillReceiveProps(props) {
        this.setState({isOpen: props.isOpen});
    }




    createNewScript() {
        console.log('writing to scripts collection...');

        store.dispatch({type: 'CREATE_SCRIPT_INITIALIZED', isScriptCreation: true});

        db.collection("scripts").add({
            creator: this.props.user.uid,
            scope: 'private',
            createdTime: Date.now(),
            updatedTime: Date.now(),
            type: 'argument',
            title: 'Untitled',
            collaborators: [this.props.user.uid]
        })
            .then(function(scriptRef) {
                console.log("Document written with ID: ", scriptRef.id);

                db.collection('scripts').doc(scriptRef.id).update({uid: scriptRef.id});

                let permissionObj = {};
                permissionObj['permission'] = 'write';
                permissionObj['uid'] = this.props.user.uid;
                permissionObj['email'] =  this.props.user.email;
                permissionObj['isOwner'] = true;

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
                            uid: scriptRef.id,
                            title: 'Untitled'
                        });

                        store.dispatch({type: 'SCRIPT_CREATION_FINISHED', isScriptCreation: false});
                        this.props.history.push('/s/' + scriptRef.id);
                        window.location.reload();


                    }.bind(this))

            }.bind(this))
            .catch(function(error) {
                store.dispatch({type: 'SCRIPT_CREATION_FINISHED', isScriptCreation: false});
                console.error("Error adding document: ", error);
            });
    }


    onHomeClick() {
        this.props.disableSidebar();
        store.dispatch({type: 'SET_ACTIVE_SCRIPT_ID', activeScriptId: null})
    }

    onProfileClick() {
        this.props.disableSidebar();
        // store.dispatch({type: 'SET_ACTIVE_SCRIPT_ID', activeScriptId: null})
    }

    render() {
        var sidebarClass = this.state.isOpen ? 'sidebar open' : 'sidebar';
        return (
            <div ref={this.setWrapperRef} className={sidebarClass} style={{display: 'flex', flexDirection: 'column', zIndex: 5000}}>

                <div style={{flex: 1}}>
                    <div style={{marginTop: '10px', marginBottom: '24px', height: '64px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <img style={{width: 40, height: 40, padding: '5px'}} src={scripptLogo}></img>
                        <div style={{opacity: '.55', fontSize: '22px'}}>
                        Scrippt
                        </div>
                        <sup style={{opacity: 0.5}}> beta</sup>
                    </div>

                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40px', marginBottom: '12px'}}>
                        <div onClick={this.createNewScript.bind(this)} style={{padding: '8px', borderRadius: '2px', width: '150px', borderColor: '#1565c0', display: 'flex', alignItems: 'center', background: '#1565c0', color: 'white',  cursor: 'pointer', flexDirection: 'row', alignSelf: 'center'}}>
                            <i className="material-icons" style={{color: 'white'}}>add</i>
                            <div style={{flex: 1, paddingLeft: '5px', paddingRight: '5px', fontSize: '13px'}}>Create new script</div>
                        </div>
                    </div>

                    <div style={{display: 'flex', paddingLeft: '50px', height: '40px', alignItems: 'center'}}>
                        <i className="material-icons" style={{textDecoration: 'none', color: 'rgb(117, 117, 117)', fontSize: '32px'}}>home</i>
                        <Link to="/" style={{ color: '#555555', textDecoration: 'none', fontSize: '17px', paddingLeft: '5px' }} onClick={this.onHomeClick.bind(this)}>Home</Link>
                    </div>

                    <div style={{display: 'flex', paddingLeft: '50px', height: '40px', alignItems: 'center'}}>
                        <i className="material-icons" style={{textDecoration: 'none', color: 'rgb(117, 117, 117)', fontSize: '32px'}}>account_circle</i>
                        <Link to="/profile" style={{ color: '#555555', textDecoration: 'none', fontSize: '17px', paddingLeft: '5px' }} onClick={this.onProfileClick.bind(this)}>Profile</Link>
                    </div>

                </div>

                <div style={{display: 'flex', flex: 0, marginBottom: '56px'}}>
                    <LogoutButton/>
                </div>
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

                            store.dispatch({type: 'SET_ACTIVE_SCRIPT_ID', activeScriptId: this.props.match.params.scriptId});
                            store.dispatch({type: 'SET_TITLE', title: doc.data().title});

                            document.title = doc.data().title;

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


    render() {
        let contentClass = this.props.isOpen ? 'content open' : 'content';
        return (
            <div>
            <div className={contentClass}>

                <div className="EditorContainer">
                    <div className="tree" id="tree">
                        <Node data={this.state.tree} parentNodeId={Object.keys(this.state.tree)[0]} scriptId={this.props.match.params.scriptId} premiseRelativeValue={this.state.premiseRelativeValue}/>
                    </div>
                </div>


            </div>
            </div>
        );
    }
}


class Signup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            signupEmail: '',
            signupPassword: '',
            signupUsername: '',
            usernameMessage: '',
            usernameMessageColor: '',
            usernameHasChanged: false,
            usernameVerified: true,
            signupConfirmPassword: '',
            signupError: '',
            isAuthChecked: false,
            scriptIds: []
        };
    }

    componentWillMount(props) {
        this.timer = null;
    }


    handleSignupEmailChange(event) {
        this.setState({signupEmail: event.target.value});
    }

    handleSignupPasswordChange(event) {
        this.setState({signupPassword: event.target.value});

        if(event.target.value.length < 6) {
            event.target.setCustomValidity("password should be at least 6 characters")
        } else {
            event.target.setCustomValidity("")
        }

    }

    handleSignupConfirmPasswordChange(event) {
        this.setState({signupConfirmPassword: event.target.value});
        if(event.target.value !== this.state.signupPassword) {
            event.target.setCustomValidity("Passwords don't match")
        } else {
            event.target.setCustomValidity("")
        }
    }

    handleUsernameChange(event) {
        this.setState({signupUsername: event.target.value, usernameHasChanged:true, usernameVerified: false});
        let regexValidator = /^[a-zA-Z0-9]+([_-]?[a-zA-Z0-9])*$/;

        if(!regexValidator.test(event.target.value)) {
            event.target.setCustomValidity("Username isn't valid")
        } else {
            event.target.setCustomValidity("")
        }

        if(event.target.value.length>20) {
            event.target.setCustomValidity("username shouldn't be more than 20 characters")
        } else {
            event.target.setCustomValidity("")
        }

        clearTimeout(this.timer);
        this.timer = setTimeout(this.checkUsername.bind(this, event.target.value), 1000);

    }

    checkUsername(username) {
        console.log('checking for username...');


        // let helloUserUrl = 'https://us-central1-argument-app.cloudfunctions.net/app/share';
        let helloUserUrl = 'http://localhost:5000/argument-app/us-central1/app/checkUsername';

        let params = "username=" + username;

        console.log('Sending request to', helloUserUrl + "?" + params, 'with ID token in Authorization header.');
        var req = new XMLHttpRequest();
        req.onload = function() {
            console.log('onload-username:', req.responseText);
            let colorCode = {
                '0': 'red',
                '1': 'green',
                '2': 'red'
            }
            this.setState({usernameHasChanged: false, usernameVerified: JSON.parse(req.responseText).code===1, usernameMessage: JSON.parse(req.responseText).msg, usernameMessageColor: colorCode[JSON.parse(req.responseText).code]})
            return true;
        }.bind(this);
        req.onerror = function() {
            console.log('onerror;', 'error');
            this.setState({usernameHasChanged: false, usernameVerified: false});
            return -100;
        }.bind(this);
        req.open('GET', helloUserUrl + "?" + params, true);
        // req.setRequestHeader('Authorization', 'Bearer ' + token);
        req.send();
    }


    handleSignupSubmit(event) {
        if(this.state.signupPassword!==this.state.signupConfirmPassword) {
            this.setState({signupError: "passwords don't match"});
            event.preventDefault();
        }
        if(!this.state.usernameHasChanged && this.state.usernameVerified) {
            this.signup(this.state.signupEmail, this.state.signupPassword, this.state.signupUsername);
            event.preventDefault();
        }
        else {
            this.setState({signupError: this.state.usernameMessage});
            event.preventDefault();
        }

    }


    signup(email, password, username) {

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
                    username: this.state.signupUsername
                    // providerData: user.providerData
                })
                    .then(function() {
                        console.log("user added to database");
                    })
                    .catch(function(error) {
                        console.error("Error adding document: ", error);
                    });

            }.bind(this))
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




    render() {
        return <div style={{width: '350px'}}>

            <div style={{background: '#1565c0', color: 'white', textAlign: 'center', padding: '10px', fontSize: '19px'}}>Signup</div>
            <form style={{width: '100%'}} id="signup" onSubmit={this.handleSignupSubmit.bind(this)}>

                <div style={{paddingTop: '30px', paddingLeft: '50px', paddingRight: '50px', paddingBottom: '10px'}}>
                    <input style={{width: '100%', height: '25px', fontSize: '14px'}} type="email" placeholder="email" required value={this.state.signupEmail}
                           onChange={this.handleSignupEmailChange.bind(this)}/>
                </div>

                <div style={{paddingLeft: '50px', paddingRight: '50px'}}>
                    <input style={{width: '100%', height: '25px', fontSize: '14px'}} type="text" placeholder="username" required value={this.state.signupUsername}
                           onChange={this.handleUsernameChange.bind(this)}/>
                </div>
                <span style={{fontSize: '13px', paddingLeft: '50px', color: this.state.usernameMessageColor}}>{this.state.usernameMessage}</span>

                <div style={{paddingLeft: '50px', paddingRight: '50px', paddingBottom: '10px', paddingTop: '10px'}}>
                    <input style={{width: '100%', height: '25px', fontSize: '14px'}} type="password" placeholder="password" required value={this.state.signupPassword}
                           onChange={this.handleSignupPasswordChange.bind(this)}/>
                </div>

                <div style={{paddingLeft: '50px', paddingRight: '50px', paddingBottom: '20px'}}>
                    <input id="confirm_password" style={{width: '100%', height: '25px', fontSize: '14px'}} type="password" placeholder="confirm password" required value={this.state.signupConfirmPassword}
                           onChange={this.handleSignupConfirmPasswordChange.bind(this)}/>
                </div>

                <div style={{paddingLeft: '50px', paddingRight: '50px'}}>
                    <input style={{width: '100%', fontSize: '14px', height: '30px', background: '#1565c0', borderColor: 'transparent', color: '#fff',cursor: 'pointer' }} type="submit" value="Submit"/>
                </div>
            </form>
            <span style={{fontSize: '13px', paddingLeft: '50px', color: 'red', paddingBottom: '40px'}}>
                {this.state.signupError}
            </span>

        </div>
    }
}

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            loginValue: '',
            loginPassword: '',
            loginError: '',
            isAuthChecked: false,
            scriptIds: []
        };
    }


    handleLoginValueChange(event) {
        this.setState({loginValue: event.target.value});
    }

    handleLoginPasswordChange(event) {
        this.setState({loginPassword: event.target.value});
        if(event.target.value.length < 6) {
            event.target.setCustomValidity("password should be at least 6 characters")
        } else {
            event.target.setCustomValidity("")
        }
    }



    async login(email, password) {
        const result = await auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log('auth-error:##################################', error, errorCode);
            this.setState({loginError: errorMessage, error: error, errorCode: errorCode})
            if(!error) {
                this.props.closeLoginModal();
                this.props.history.push('/');
            }
            // ...
        }.bind(this));

    }


    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }


    fetchUserFromUsername(username, password) {
        console.log('checking for username...');

        // let helloUserUrl = 'https://us-central1-argument-app.cloudfunctions.net/app/share';
        let helloUserUrl = 'http://localhost:5000/argument-app/us-central1/app/fetchUserFromUsername';

        let params = "username=" + username;

        console.log('Sending request to', helloUserUrl + "?" + params, 'with ID token in Authorization header.');
        var req = new XMLHttpRequest();
        req.onload = function() {
            console.log('onload-username:', req.responseText);
            let colorCode = {
                '0': 'red',
                '1': 'green',
                '2': 'red'
            }
            if(JSON.parse(req.responseText).code===1) {
                this.login(JSON.parse(req.responseText).email, password)
                return true;
            }

            else if(JSON.parse(req.responseText).code===0) {
                this.setState({loginError: "username doesn't exist"})
            }

            else if(JSON.parse(req.responseText).code===2) {
                this.setState({loginError: "an unexpected error has occured"})
            }


            return true;
        }.bind(this);
        req.onerror = function() {
            console.log('onerror;', 'error');
            this.setState({usernameHasChanged: false, usernameVerified: false, loginError: 'an unexpected error has occured'});
            return -100;
        }.bind(this);
        req.open('GET', helloUserUrl + "?" + params, true);
        // req.setRequestHeader('Authorization', 'Bearer ' + token);
        req.send();
    }

    handleLoginSubmit(event) {
        this.setState({loginError: ''})

        if(this.validateEmail(this.state.loginValue)) {
            this.login(this.state.loginValue, this.state.loginPassword);
            event.preventDefault();
        }
        else {
            this.fetchUserFromUsername(this.state.loginValue, this.state.loginPassword);
            event.preventDefault();

        }

    }



    render() {
        return <div style={{width: '350px'}}>
            <div style={{background: '#1565c0', color: 'white', textAlign: 'center', padding: '10px', fontSize: '19px'}}>Login</div>
            <form style={{width: '100%'}} id="login" onSubmit={this.handleLoginSubmit.bind(this)}>
                <div style={{paddingTop: '20px', paddingLeft: '50px', paddingRight: '50px', paddingBottom: '10px'}}>
                    <input style={{width: '100%', height: '25px', fontSize: '14px'}} type="text" placeholder='enter email or username' required value={this.state.loginValue}
                           onChange={this.handleLoginValueChange.bind(this)}/>

                </div>
                <div style={{paddingLeft: '50px', paddingRight: '50px', paddingBottom: '20px'}}>
                    <input style={{width: '100%', height: '25px', fontSize: '14px'}} type="password" placeholder="enter password" required value={this.state.loginPassword}
                           onChange={this.handleLoginPasswordChange.bind(this)}/>
                </div>
                <div style={{paddingLeft: '50px', paddingRight: '50px'}}>
                    <input style={{width: '100%', fontSize: '14px', height: '30px', background: '#1565c0', borderColor: 'transparent', color: '#fff',cursor: 'pointer' }} type="submit" value="Submit"/>
                </div>
            </form>
            <div style={{color: 'red', fontSize: '13px', paddingLeft: '50px', paddingRight: '50px', paddingBottom: '25px'}}>{this.state.loginError}</div>

            <button onClick={this.props.openForgotPasswordModal}>forgot</button>

        </div>
    }
}

class Landing extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        document.title = 'Scrippt';
    }

    render() {
        return (
            <div style={{display: 'flex', flex: 1, height: '100vh', flexDirection: 'column'}}>
                <div style={{ flex: 1, marginTop: '100px'}}>
                    Landing page
                </div>

                <div style={{ flex: 0, alignSelf: 'center', marginBottom: '20px'}}>
                    Footer
                </div>
            </div>
        )
    }
}

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
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
                    username: user.username,
                    emailVerified: user.emailVerified,
                    photoURL: user.photoURL,
                    isAnonymous: user.isAnonymous,
                    uid: user.uid
                };

                this.setState({user: userObj});

                db.collection("users").doc(user.uid).get().then(function(doc) {
                    this.setState({user:  doc.data()});
                }.bind(this)).catch(function(error) {
                    console.log("Error getting user:", error);
                });


                db.collection("users").doc(user.uid).collection('scripts')
                    .onSnapshot(function(querySnapshot) {
                        console.log('onsnapshot triggered');
                        let scriptIds = [];
                        querySnapshot.forEach(function(doc) {
                            scriptIds.push(doc.data().uid)
                        });

                        console.log('found ', scriptIds.length, 'scripts');
                        store.dispatch({type: 'SCRIPT_FETCH_COMPLETE', scriptFetchComplete: true, numScripts: scriptIds.length});

                        //deleting script headers
                        if(scriptIds.length < this.state.scriptIds.length) {
                            console.log('inside delete')
                            Array.prototype.diff = function(a) {
                                return this.filter(function(i) {return a.indexOf(i) < 0;});
                            };
                            let scriptHeaders = this.state.scriptHeaders;
                            let scriptHeadersToDelete = this.state.scriptIds.diff(scriptIds);
                            scriptHeadersToDelete.forEach(function (scriptId) {
                                delete scriptHeaders[scriptId];
                            })
                            this.setState({scriptHeaders: scriptHeaders})

                        }

                        this.setState({scriptIds: scriptIds});

                        scriptIds.map(function(id) {

                            db.collection('scripts').doc(id).get().then(function (doc) {
                                console.log('inside here')
                                if(this.state['scriptHeaderObj']===undefined || this.state['scriptHeaderObj']===null) {
                                    let scriptHeaderObj = Object.assign({}, this.state.scriptHeaders, {[id]: doc.data() });
                                    scriptHeaderObj[id] = doc.data();
                                    this.setState({scriptHeaders: scriptHeaderObj});
                                }
                                else {
                                    let scriptHeaderObj = Object.assign({}, this.state.scriptHeaders, {[id]: doc.data() });
                                    scriptHeaderObj[id] = doc.data();
                                    this.setState({scriptHeaders: scriptHeaderObj});
                                }
                            }.bind(this))

                        }.bind(this))

                    }.bind(this), function(error) {
                        console.log('user-fetch-scriptId-error', error);
                    });




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
                return (
                    <BrowserRouter>
                        <div>
                            <Route exact path="/" render={(props) => ( !this.state.user ? <Landing {...props} /> : null)}/>
                            <Route exact path="/login" render={(props) => ( !this.state.user ? <Login {...props}  /> : <Redirect to="/"/> )}/>
                            <Route exact path="/signup" render={(props) => ( !this.state.user ? <Signup {...props} /> : <Redirect to="/"/> )}/>
                            <Route render={(props) => ( <Parent {...props} user={this.state.user} scriptIds={this.state.scriptIds} scriptHeaders={this.state.scriptHeaders}/> )}/>
                        </div>
                    </BrowserRouter>
                )
        }
        else {
            return (
              <Loader/>
            );
        }
    }
}


export default App;
