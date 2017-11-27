import React, { Component } from 'react';
import './App.css';
import './Node.css';
import './Layout.css';
import createBrowserHistory from 'history/createBrowserHistory'

import argumentLogo from './argument_icon.png';
import shareIcon from './share_icon.png';

import ReactDOM from 'react-dom';

import { Grid, Row, Col } from 'react-flexbox-grid';
import Dropdown from 'react-dropdown';

import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';

import {
    BrowserRouter,
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


function mainReducer(state = {activeScriptId: null, value: null}, action) {
    switch (action.type) {

        case 'SET_ACTIVE_SCRIPT_ID':
            return {...state, activeScriptId: action.activeScriptId};
        case 'SET_TITLE':
            return {...state, title: action.title};
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
            text: '',
            showTools: false,
            value: 0,
            textAreaHeight: '50px',
            textAreaWidth: '275px',
            activeNode: null,
            hoveredNode: null
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
        console.log('text area clicked:', evt.target.style.height, evt.target.style.width);


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
        this.setState({showTools: true, activeNode: node.uid});
    }

    onBlur(node, evt) {
        console.log('onBlur')
        this.setState({showTools: true,  activeNode: null})
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

                        let footer = null;

                        if(this.state.activeNode === node.uid || this.state.hoveredNode === node.uid) {
                            footer = (
                                <div onMouseOver={this.onNodeHoveredIn.bind(this, node)} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>

                                    <i data-tip='custom show' data-event='click focus' onClick={()=>{console.log('im in here')}} className="material-icons" style={{ cursor: 'pointer', color: '#9e9e9e' }}>add_circle</i>
                                    <ReactTooltip globalEventOff='click' place="bottom" />

                                    <button onMouseOver={this.onNodeHoveredIn.bind(this, node)} onMouseOut={this.onNodeHoveredOut.bind(this, node)} style={{  background: labelColorMap[-1*currentNodeValue], cursor: 'pointer', borderColor: labelColorMap[-1*currentNodeValue], color: '#fff', borderRadius: '10px', outline: '0', margin: '2px'}} onClick={this.onAddClick.bind(this, node, "but")} type="button">but</button>
                                    <button onMouseOver={this.onNodeHoveredIn.bind(this, node)} onMouseOut={this.onNodeHoveredOut.bind(this, node)} style={{  background: labelColorMap[currentNodeValue], cursor: 'pointer', borderColor: labelColorMap[currentNodeValue], color: '#fff', borderRadius: '10px', outline: '0', margin: '2px'}} onClick={this.onAddClick.bind(this, node, "because")} type="button">because</button>
                                </div>
                            );
                        }


                        return (
                            <li key={node.uid}>
                                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                    {/*<div className="circle"></div>*/}
                                    <div style={{
                                        background: 'white',
                                        padding: '10px',
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

                                        <textarea
                                            id={node.uid}
                                            key={node.text}
                                            style={{background: color, width: width, height: height}}
                                            onFocus={this.onFocus.bind(this, node)}
                                            onBlur={this.onBlur.bind(this, node)}
                                            onChange={this.onChange.bind(this, node)}
                                            onClick={this.onTextAreaClick.bind(this, node)}
                                            autoFocus={true}
                                            defaultValue={node.text}>
                                        </textarea>

                                        {footer}

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

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
        store.dispatch({type: 'SET_ACTIVE_SCRIPT_ID', activeScriptId: null})

    }

    createNewScript() {
        console.log('writing to scripts collection...');

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

                        this.props.history.push('/s/' + scriptRef.id);
                        window.location.reload();


                    }.bind(this))

            }.bind(this))
            .catch(function(error) {
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


    render() {

        const SCRIPT_ROUTE = (scriptId) => `/s/${scriptId}/`;

        let scriptHeaderFragment = (<div></div>);

        let initFragment = (
            <Col xs={12} sm={3} md={2} lg={1}  style={{marginBottom: '80px', marginLeft: '80px', marginRight: '80px'}}>
                {/*<Link activeStyle={{}} to={SCRIPT_ROUTE(this.props.scriptHeaders[key].uid)} style={{textDecoration: 'none'}} params={{scriptId: this.props.scriptHeaders[key].uid}}>*/}
                    <div onClick={this.createNewScript.bind(this)} style={{cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems:"center",justifyContent:"center", width: 200, height: 225, background: 'white', boxShadow: '1px 1px 4px rgba(0,0,0,.3)'}} key={123}>
                        <i className="material-icons" style={{textDecoration: 'none', color: '#1976d2', fontSize: '100px'}}>note_add</i>
                        create
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
                                <img style={{width: 80, height: 80}} src={argumentLogo}></img>
                                {/*{this.props.scriptHeaders[id]['uid']}*/}
                                {this.props.scriptHeaders[key].title}
                                <a href="javascript:;" onClick={this.deleteScript.bind(this, this.props.user.uid, this.props.scriptHeaders[key].uid)}>
                                    <i className="material-icons" style={{textDecoration: 'none', color: 'rgb(117, 117, 117)', fontSize: '20px'}}>delete_forever</i>
                                </a>
                                <br/>
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
                <Header user={this.props.user} onClick={this.handleViewSidebar.bind(this)} />

                <Route render={(props) => ( <SideBar {...props} isOpen={this.state.sidebarOpen} user={this.props.user}/>)}/>

                <Switch>
                    <Route exact path="/s/:scriptId" render={(props) => (
                        <Editor
                            {...props}
                            disableSidebar={this.disableSidebar.bind(this)}
                            isOpen={this.state.sidebarOpen}/>
                    )} />
                    <Route exact path="/" render={(props) => ( <Home {...props} user={this.props.user} scriptIds={this.props.scriptIds} scriptHeaders={this.props.scriptHeaders}/> )}/>
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


    constructor(props) {
        super(props);
        this.state = {
            tree: {},
            premiseNode: "",
            premiseRelativeValue: 1,
            centerLock: true,
            modalIsOpen: false,
            activeScriptId: null,
            title: '',
            collaborators: [],
            shareEmailField: '',
            permissionValue: 'read-only',
            shareModalMessage: ''
        };

        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount() {
        store.subscribe(() => {
            console.log('inside header:', store.getState());
            this.setState({activeScriptId: store.getState().activeScriptId, title: store.getState().title})

            if(store.getState().activeScriptId!==null && store.getState().activeScriptId!==undefined) {
                db.collection('scripts').doc(store.getState().activeScriptId).collection('collaborators').get()
                    .then(function (querySnapshot) {
                        querySnapshot.forEach(function (doc) {
                            console.log(doc.id, " => ", doc.data());
                            let collaborators = this.state.collaborators;
                            collaborators[doc.id] = doc.data();
                            this.setState({collaborators: collaborators})
                        }.bind(this));
                    }.bind(this))
                }
            }
        )
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
        this.setState({modalIsOpen: false, shareModalMessage: '', shareEmailField: ''});
    }

    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }


    onShareFormSubmit(evt) {
        evt.preventDefault();
        if(this.validateEmail(this.state.shareEmailField)) {
            this.share(this.state.shareEmailField, this.state.permissionValue, this.state.activeScriptId);
        }
        else {
            this.setState({shareModalMessage: 'invalid email id format'})
        }
    }

    handleShareModalEmailInputChange(event) {
        this.setState({shareEmailField: event.target.value});
        if(event.target.value.length===0 || this.validateEmail(event.target.value)) {
            this.setState({shareModalMessage: ''});
        }
    }

    handlePermissionChange(event) {
        this.setState({permissionValue: event.target.value});
    }

    share(email, permission, activeScriptId) {
        let permissionObj = {};
        permissionObj['permission'] = permission;

        // let helloUserUrl = 'https://us-central1-argument-app.cloudfunctions.net/app/share';
        let helloUserUrl = 'http://localhost:5000/argument-app/us-central1/app/share';

        let id = email;
        let type = 'email';
        let params = "id=" + id + "&" + "type=" + type + "&" + "scriptId=" + activeScriptId + "&" + "accessLevel=" + permission;

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


    }

    onTitleHitEnter(evt) {
        var keycode = evt.charCode || evt.keyCode;
        if (keycode  === 13) { //Enter key's keycode
            console.log('im in here');
            evt.preventDefault();
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

    render() {
        const collaborators = (Object.keys(this.state.collaborators).map(function(key) {
           return (
               <div>
                   {this.state.collaborators[key]['email']}
               </div>
           );
        }.bind(this)));

        let shareModalMessage = (<br/>);
        if(this.state.shareModalMessage.length>0) {
            shareModalMessage = this.state.shareModalMessage;
        }

        let headerSubSection = (
            <div style={{display: 'flex', flex: 1, flexDirection: 'row',  alignItems: 'center', justifyContent: 'center'}}>

                <div style={{display: 'flex', flex: 1,  alignItems: 'center', justifyContent: 'center'}}>
                    <span ref="title" onBlur={this.onTitleChange.bind(this)} onKeyPress={this.onTitleHitEnter.bind(this)} contentEditable="true" style={{padding: '5px', minWidth: '50px', maxWidth: '500px', fontSize: '18px', overflow: 'hidden', whiteSpace: 'nowrap'}}>{this.state.title}</span>
                </div>

                <div style={{flex: 0, marginRight: '32px'}}>
                    <Modal
                        isOpen={this.state.modalIsOpen}
                        onAfterOpen={this.afterOpenModal}
                        onRequestClose={this.closeModal}
                        style={customStyles}
                        contentLabel="Example Modal"
                    >
                        <div style={{display: 'flex', flex: 1, flexDirection: 'row'}}>
                            <h4 ref={subtitle => this.subtitle = subtitle} style={{flex: 1, margin: 0, color: 'black'}}>Share settings</h4>
                            <a href="javascript:;" onClick={this.closeModal}>
                                <i className="material-icons" style={{textDecoration: 'none', color: 'rgb(117, 117, 117)', fontSize: '20px'}}>close</i>
                            </a>
                        </div>

                        <div>
                            {collaborators}
                        </div>

                        <div>Add a collaborator</div>
                        <form onSubmit={this.onShareFormSubmit.bind(this)}>
                            <input type="text" value={this.state.shareEmailField} onChange={this.handleShareModalEmailInputChange.bind(this)} />
                            <select name="permission" value={this.state.permissionValue} onChange={this.handlePermissionChange.bind(this)}>
                                <option value="read-only">can view</option>
                                <option value="write">can edit</option>
                            </select>
                            <button>add</button>

                        </form>
                        <div>{shareModalMessage}</div>

                    </Modal>
                    <div onClick={this.openModal} style={{padding: '8px', borderRadius: '2px', borderColor: '#0d47a1', display: 'flex', flex: 1, background: '#1565c0', color: 'white',  cursor: 'pointer', flexDirection: 'row'}}>
                        <img style={{flex: 1, width: 12, height: 12}} src={shareIcon}></img>
                        <div style={{flex: 1, paddingLeft: '5px', paddingRight: '5px', fontSize: '12px'}}>Share</div>
                    </div>
                </div>

            </div>
        );

        if(store.getState().activeScriptId===null) {
            headerSubSection = (
                <div style={{flex: 1}}>

                </div>
            );
        }
        return (
            <header style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{marginLeft: '24px'}}>
                    <a href="javascript:;" onClick={this.props.onClick}>
                        <i className="material-icons" style={{textDecoration: 'none', color: 'rgb(117, 117, 117)', fontSize: '28px'}}>menu</i>
                    </a>
                </div>
                {headerSubSection}
            </header>
        );
    }
}

class SideBar extends Component{

    constructor(props, context) {
        super(props, context);

        this.state = {
            isOpen: false
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
            console.log('im in here')
            this.setState({isOpen: false});
        }
    }

    componentWillReceiveProps(props) {
        this.setState({isOpen: props.isOpen});
    }




    createNewScript() {
        console.log('writing to scripts collection...');

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

                        this.props.history.push('/s/' + scriptRef.id);
                        window.location.reload();


                    }.bind(this))

            }.bind(this))
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
    }


    onHomeClick() {
        store.dispatch({type: 'SET_ACTIVE_SCRIPT_ID', activeScriptId: null})
    }

    render() {
        var sidebarClass = this.state.isOpen ? 'sidebar open' : 'sidebar';
        return (
            <div ref={this.setWrapperRef} className={sidebarClass} style={{display: 'flex', flexDirection: 'column', zIndex: 5000}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40px'}}>
                    <input id="newScript" type="button" value="Create new script" onClick={this.createNewScript.bind(this)} />
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40px'}}>
                    <i className="material-icons" style={{textDecoration: 'none', color: 'rgb(117, 117, 117)', fontSize: '24px'}}>home</i>
                    <Link to="/" onClick={this.onHomeClick.bind(this)}>Home</Link>
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40px'}}>
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
                        console.log('onsnapshot triggered');
                        let scriptIds = [];
                        querySnapshot.forEach(function(doc) {
                            scriptIds.push(doc.data().uid)
                        });


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
                    <BrowserRouter>
                        <Parent user={this.state.user} scriptIds={this.state.scriptIds} scriptHeaders={this.state.scriptHeaders}/>
                    </BrowserRouter>
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
