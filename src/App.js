import React, {Component} from "react";
import "./App.css";
import "./Node.css";
import "./Layout.css";
import "./Fallacy.css";

import createBrowserHistory from "history/createBrowserHistory";

import argumentLogo from "./argument_icon.png";
import scripptLogo from './scrippt_logo_40px.png';

import shareIcon from "./share_icon.png";
import landingSectionOne from './landing_section_one.png';
import landingSectionTwo from './landing_section_two.png';
import landingSectionThree from './landing_section_three.png';
import landingSectionArgumentMap from './landing_section_four_argument_map.png';
import landingSectionDecisionTree from './landing_section_four_decision_tree.png';
import landingSectionNestedList from './landing_section_four_nested_list.png';
import landingSectionFive from './landing_section_five.png';

import anonymousLogin from './anonymous_login.png';

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

// console.log = function() {}
// console.error = function() {}

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


const noteModalStyles = {
    content : {
        padding: '0px',
        top                   : '50%',
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



const fallacyModalStyles = {
    content : {
        padding: '0px',
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
    },
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255, 255, 255, 0.75)",
        zIndex: 10000,
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


function mainReducer(state = {activeScriptId: null, value: null, scriptFetchComplete: false, numScripts: 0, isScriptCreation: false, highlightedNode: '', hotkeysEnabled: true}, action) {
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
        case 'SCRIPT_NUM_UPDATE':
            return {...state, numScripts: action.numScripts};
        case 'SET_HIGHLIGHTED_NODE':
            return {...state, highlightedNode: action.highlightedNode};
        case 'SET_HOTKEYS_ENABLED_FLAG':
            return {...state, hotkeysEnabled: action.hotkeysEnabled};
        default:
            return state
    }
}


// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
// let store = createStore(mainReducer, applyMiddleware(logger));

let store = createStore(mainReducer);

// You can use subscribe() to update the UI in response to state changes.
// Normally you'd use a view binding library (e.g. React Redux) rather than subscribe() directly.
// However it can also be handy to persist the current state in the localStorage.

// store.subscribe(() =>
//     console.log(store.getState())
// )


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



class Source extends Component {

    onTextAreaClick(node, evt) {

    }



    onFocus(node, evt) {
    }

    onBlur(node, evt) {
    }

    fetchUrlMetadata(url) {

        // let helloUserUrl = 'https://us-central1-argument-app.cloudfunctions.net/app/fetchUrlMetadata';
        let helloUserUrl = 'http://localhost:5000/argument-app/us-central1/app/fetchUrlMetadata';

        let params = "url=" + url;

        firebase.auth().currentUser.getToken().then(function(token) {
            var req = new XMLHttpRequest();
            req.onload = function() {
                if(JSON.parse(req.responseText).code===1) {
                    console.log('url:', JSON.parse(req.responseText).responseObj);

                    db.collection("scripts").doc(this.props.scriptId).collection('nodes').doc(this.props.node['uid']).update({
                        sourceMetadata: JSON.parse(req.responseText).responseObj,
                        updatedTime: Date.now()
                    });

                    return true;
                }

                else if(JSON.parse(req.responseText).code===-1) {
                    console.log('url metadata error')
                }

                return true;
            }.bind(this);
            req.onerror = function(err) {
                console.log(err);
                return -100;
            }.bind(this);
            req.open('GET', helloUserUrl + "?" + params, true);
            req.setRequestHeader('Authorization', 'Bearer ' + token);
            req.send();
        }.bind(this));
    }

    onChange = (node, evt) => {

        this.setState({source: evt.target.value})

        clearTimeout(this.timer);

        this.timer = setTimeout(this.triggerChange.bind(this, evt.target.value), 1000);


    }


    triggerChange(source) {

        if(source.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi) )) {
            this.fetchUrlMetadata(source);
        }

        db.collection("scripts").doc(this.props.scriptId).collection('nodes').doc(this.props.node['uid']).update({
            source: source,
            updatedTime: Date.now()
        });

        db.collection('users').doc(this.props.user.uid).collection('scripts').doc(this.props.scriptId).update({
            updatedTime: Date.now()
        });

        db.collection('scripts').doc(this.props.scriptId).update({
            updatedTime: Date.now()
        });
    }


    render() {
        return (
            <div style={{margin: '20px', display: 'flex', flexDirection: 'column'}}>
                <div style={{display: 'flex', paddingBottom: '10px', fontWeight: 'bold'}}>
                    <i className="material-icons" style={{textDecoration: 'none', color: '#1565c0', fontSize: '24px', marginRight: '3px'}}>link</i>
                Add source
                </div>
                <Textarea
                    style={{resize: 'none', width: '400px', border: 'solid 1px #1565c0', outline: 'none', borderRadius: '0px'}}
                    autoFocus={true}
                    defaultValue={this.props.node.source}
                    onFocus={this.onFocus.bind(this, {})}
                    onBlur={this.onBlur.bind(this, {})}
                    onChange={this.onChange.bind(this, {})}
                    onClick={this.onTextAreaClick.bind(this, {})}
                />
            </div>
        )
    }
}






class Fallacy extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedFallacy: null
        };
    }

    componentDidMount() {
        this.setState({selectedFallacy: this.props.node.fallacy})
    }



    onFallacyClick(fallacy, evt) {

        this.setState({selectedFallacy: fallacy});
        db.collection("scripts").doc(this.props.scriptId).collection('nodes').doc(this.props.node['uid']).update({
            fallacy: fallacy,
            updatedTime: Date.now()
        });
    }

    removeSelectedFallacy(fallacy, evt) {
        this.setState({selectedFallacy: null});

        db.collection("scripts").doc(this.props.scriptId).collection('nodes').doc(this.props.node['uid']).update({
            fallacy: null,
            updatedTime: Date.now()
        });
    }

    render() {

        let fallacies = [
            {title: 'strawman', shortDescription: "Misrepresenting someone's argument to make it easier to attack."},
            {title: 'false cause', shortDescription: "Presuming that a real or perceived relationship between things means that one is the cause of the other."},
            {title: 'appeal to emotion', shortDescription: 'Manipulating an emotional response in place of a valid or compelling argument.'},
            {title: 'the fallacy fallacy', shortDescription: "Presuming that because a claim has been poorly argued, or a fallacy has been made, that the claim itself must be wrong."},
            {title: 'slippery slope', shortDescription: "Asserting that if we allow A to happen, then Z will consequently happen too, therefore A should not happen."},
            {title: 'ad hominem', shortDescription: "Attacking your opponent's character or personal traits in an attempt to undermine their argument."},
            {title: 'tu quoque', shortDescription: "Avoiding having to engage with criticism by turning it back on the accuser - answering criticism with criticism."},
            {title: 'personal incredulity', shortDescription: "Saying that because one finds something difficult to understand that it's therefore not true."},
            {title: 'special pleading', shortDescription: "Moving the goalposts or making up exceptions when a claim is shown to be false."},
            {title: 'loaded question', shortDescription: "Asking a question that has a presumption built into it so that it can't be answered without appearing guilty."},
            {title: 'burden of proof', shortDescription: "Saying that the burden of proof lies not with the person making the claim, but with someone else to disprove."},
            {title: 'ambiguity', shortDescription: "Using double meanings or ambiguities of language to mislead or misrepresent the truth."},



            {title: "the gambler's fallacy", shortDescription: "Believing that 'runs' occur to statistically independent phenomena such as roulette wheel spins."},
            {title: 'bandwagon', shortDescription: "Appealing to popularity or the fact that many people do something as an attempted form of validation."},
            {title: 'appeal to authority', shortDescription: "Saying that because an authority thinks something, it must therefore be true."},
            {title: 'composition/division', shortDescription: "Assuming that what's true about one part of something has to be applied to all, or other, parts of it."},
            {title: 'no true scotsman', shortDescription: "Making what could be called an appeal to purity as a way to dismiss relevant criticisms or flaws of an argument."},
            {title: 'genetic', shortDescription: "Judging something good or bad on the basis of where it comes from, or from whom it comes."},
            {title: 'black-or-white', shortDescription: "Where two alternative states are presented as the only possibilities, when in fact more possibilities exist."},
            {title: 'begging the question', shortDescription: "A circular argument in which the conclusion is included in the premise."},
            {title: 'appeal to nature', shortDescription: "Making the argument that because something is 'natural' it is therefore valid, justified, inevitable, good, or ideal."},
            {title: 'anecdotal', shortDescription: "Using personal experience or an isolated example instead of a valid argument, especially to dismiss statistics."},
            {title: 'the texas sharpshooter', shortDescription: "Cherry-picking data clusters to suit an argument, or finding a pattern to fit a presumption."},
            {title: 'middle ground', shortDescription: "Saying that a compromise, or middle point, between two extremes is the truth."},

        ];


        return (
            <div style={{width: '500px', padding: '20px'}}>
                <div style={{display: 'flex', paddingBottom: '20px'}}>
                    <i className="material-icons" style={{textDecoration: 'none', color: 'orange', fontSize: '24px', marginRight: '3px'}}>warning</i>
                    <div style={{fontWeight: 'bold', fontSize: '18px'}}>report fallacy</div>
                </div>
                {
                    this.state.selectedFallacy &&
                    <div style={{display: 'flex'}}>
                        <div style={{padding: '8px'}}>
                            <a href="javascript:;" onClick={this.removeSelectedFallacy.bind(this)}
                               title="remove fallacy">
                                <i className="material-icons"
                                   style={{textDecoration: 'none', color: '#c62828', fontSize: '25px'}}>remove_circle</i>
                            </a>
                        </div>
                        <div>
                            <div style={{fontWeight: 'bold', fontSize: '18px'}}>{this.state.selectedFallacy.title}</div>
                            <div style={{fontSize: '15px'}}>{this.state.selectedFallacy.shortDescription}</div>
                        </div>
                    </div>
                }

                <div className="fallacy-list">
                {fallacies.map( fallacy =>
                    <div key={fallacy.title} className='fallacy-item' onClick={this.onFallacyClick.bind(this, fallacy)}>
                        <div style={{fontWeight: 'bold', fontSize: '18px'}}>{fallacy.title}</div>
                        <div style={{fontSize: '15px'}}>{fallacy.shortDescription}</div>
                    </div>
                )}
                </div>

                </div>
        )
    }
}

class Note extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    onTextAreaClick(node, evt) {

    }

    componentDidMount() {

    }


    onFocus(node, evt) {
    }

    onBlur(node, evt) {
    }

    onChange = (node, evt) => {

        clearTimeout(this.timer);

        this.timer = setTimeout(this.triggerChange.bind(this, evt.target.value), 1000);


    }


    triggerChange(note) {

        db.collection('users').doc(this.props.user.uid).collection('scripts').doc(this.props.scriptId).update({
            updatedTime: Date.now()
        });

        db.collection('scripts').doc(this.props.scriptId).update({
            note: note,
            updatedTime: Date.now()
        });
    }


    render() {
        return (
            <div style={{display: 'flex', flexDirection: 'column', padding: '20px'}}>
                <h3 style={{display: 'flex', paddingBottom: '10px', margin: '0px'}}>
                    <i className="material-icons" style={{textDecoration: 'none', color: 'rgb(117, 117, 117)', fontSize: '24px', marginRight: '3px'}}>note</i>
                    Add note
                </h3>
                <Textarea
                    style={{resize: 'none', width: '500px', border: 'solid 1px rgb(117, 117, 117)', outline: 'none', borderRadius: '0px'}}
                    autoFocus={true}
                    minRows={6}
                    maxRows={20}
                    defaultValue={this.props.script.note}
                    onFocus={this.onFocus.bind(this, {})}
                    onBlur={this.onBlur.bind(this, {})}
                    onChange={this.onChange.bind(this, {})}
                    onClick={this.onTextAreaClick.bind(this, {})}
                />
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
            selectedNode: null,
            fallacyModalIsOpen: false,
            sourceModalIsOpen: false,
            removeNodeModalIsOpen: false,
            lastUpdated: Date.now(),
            highlighted: false
        };
    }

    componentWillMount(props) {
        this.timer = null;
    }

    componentDidMount() {
        store.subscribe(() => {
            if(!this.state.highlighted && (store.getState().highlightedNode === this.props.node.uid)) {
                this.setState({highlighted: true})
            }
            if(this.state.highlighted && !(store.getState().highlightedNode === this.props.node.uid)) {
                this.setState({highlighted: false})
            }
        })
    }


    shallowEqual(objA, objB) {
    if (objA === objB) {
        return true;
    }

    if (typeof objA !== 'object' || objA === null ||
        typeof objB !== 'object' || objB === null) {
        return false;
    }

    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) {
        return false;
    }

    // Test for A's keys different from B.
    var bHasOwnProperty = hasOwnProperty.bind(objB);
    for (var i = 0; i < keysA.length; i++) {
        if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
            return false;
        }
    }

    return true;
}

    shallowCompare(instance, nextProps, nextState) {
    return (
        !this.shallowEqual(instance.props, nextProps) ||
        !this.shallowEqual(instance.state, nextState)
    );
}

    shouldComponentUpdate(nextProps, nextState) {
        // if(this.shallowCompare(this, nextProps, nextState)) {
        //     console.log('update:', nextProps.uid, this.shallowCompare(this, nextProps, nextState));
        // }


        // if(this.state.lastUpdated !== nextState.lastUpdated) {
        //     console.log('node local update:', nextProps.node.uid);
        //     return true;
        // } else

            if(this.props.node.updatedTime !== nextProps.node.updatedTime) {
            return true;
        }else if(this.state.hoveredNode !== nextState.hoveredNode) {
            return true;
        } else if(this.state.sourceModalIsOpen !== nextState.sourceModalIsOpen) {
            return true;
        } else if(this.state.fallacyModalIsOpen !== nextState.fallacyModalIsOpen) {
            return true;
        } else if(this.state.highlighted !== nextState.highlighted) {
                return true;
            }
            else {
            return false;
        }

        // return this.shallowCompare(this, nextProps, nextState)
    }



    onChange = (node, evt) => {

        clearTimeout(this.timer);
        this.setState({lastUpdated: Date.now()});

        this.timer = setTimeout(this.triggerChange.bind(this, node, evt.target.value, Date.now()), 2000);


    }


    triggerChange(node ,text, updatedTime) {

        db.collection("scripts").doc(this.props.scriptId).collection('nodes').doc(node['uid']).update({
            text: text,
            updatedTime: updatedTime
        });

        db.collection('users').doc(this.props.user.uid).collection('scripts').doc(this.props.scriptId).update({
            updatedTime: updatedTime
        });

        db.collection('scripts').doc(this.props.scriptId).update({
            updatedTime: Date.now()
        });
    }


    onTextAreaClick(node, evt) {
        this.props.setHighlightedNode(node.uid);
        this.props.setHotkeysEnabledFlag(false);
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
        this.props.setHighlightedNode(node.uid);
        this.props.setHotkeysEnabledFlag(false);
        this.setState({showTools: true, selectedNode: node.uid});
    }

    onBlur(node, evt) {
        this.props.setHotkeysEnabledFlag(true);
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


    openSourceModal() {
        this.setState({sourceModalIsOpen: true})
    }

    afterOpenSourceModal() {
        store.dispatch({type: 'SET_HOTKEYS_ENABLED_FLAG', hotkeysEnabled: false});
        document.body.style.overflow = "hidden";
    }


    closeSourceModal() {
        store.dispatch({type: 'SET_HOTKEYS_ENABLED_FLAG', hotkeysEnabled: true});
        document.body.style.overflow = "auto";
        this.setState({sourceModalIsOpen: false})
    }

    openFallacyModal() {
        this.setState({fallacyModalIsOpen: true})
    }


    closeFallacyModal() {
        store.dispatch({type: 'SET_HOTKEYS_ENABLED_FLAG', hotkeysEnabled: true});
        document.body.style.overflow = "auto";
        this.setState({fallacyModalIsOpen: false})
    }

    afterOpenFallacyModal() {
        store.dispatch({type: 'SET_HOTKEYS_ENABLED_FLAG', hotkeysEnabled: false});
        document.body.style.overflow = "hidden";
    }





    onSourceClick(node) {
        this.setState({sourceModalIsOpen: true, sourceSelectedNode: node})
    }

    onFallacyClick(node) {
        this.setState({fallacyModalIsOpen: true, fallacySelectedNode: node})
    }

    render() {


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

        let node = this.props.node;

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

        if(this.state.hoveredNode === node.uid && this.props.canEdit) {
            footer = (
                <div onMouseEnter={this.onNodeHoveredIn.bind(this, node)} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>

                    <div style={{display: 'flex', width: '50px'}}>
                        <i data-tip data-for='source' className="material-icons" onClick={this.onSourceClick.bind(this, node)} style={{cursor: 'pointer', textDecoration: 'none', color: 'rgb(117, 117, 117)', fontSize: '24px', marginRight: '3px'}}>link</i>
                        <ReactTooltip id="source">Add a source</ReactTooltip>
                        <i data-tip data-for='fallacy' className="material-icons" onClick={this.onFallacyClick.bind(this, node)} style={{cursor: 'pointer', textDecoration: 'none', color: 'rgb(117, 117, 117)', fontSize: '22px'}}>report_problem</i>
                        <ReactTooltip id="fallacy">Report a fallacy on this claim</ReactTooltip>
                    </div>

                    <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <i data-tip='custom show' data-event='click focus' onClick={()=>{ }} className="material-icons" style={{ cursor: 'pointer', color: '#9e9e9e' }}>add_circle</i>
                        <ReactTooltip globalEventOff='click' place="bottom" />

                        <button data-tip data-for='but' style={{  background: labelColorMap[-1*currentNodeValue], cursor: 'pointer', borderColor: labelColorMap[-1*currentNodeValue], color: '#fff', borderRadius: '10px', outline: '0', margin: '2px'}} onClick={this.onAddClick.bind(this, node, "but")} type="button">but</button>
                        <ReactTooltip id="but">Add a statement that opposes this claim</ReactTooltip>
                        <button data-tip data-for='because' style={{  background: labelColorMap[currentNodeValue], cursor: 'pointer', borderColor: labelColorMap[currentNodeValue], color: '#fff', borderRadius: '10px', outline: '0', margin: '2px'}} onClick={this.onAddClick.bind(this, node, "because")} type="button">because</button>
                        <ReactTooltip id="because">Add a statement that supports this claim</ReactTooltip>
                    </div>
                    <div style={{display: 'flex', width: '50px', justifyContent: 'flex-end', border: '0px', padding: '0px' }}>
                    { !(node.uid === this.props.parentNodeId) &&
                    <a data-tip data-for='remove' style={{padding: 0, border: 'none'}} href="javascript:;" onClick={this.onDeleteNodeClick.bind(this, node)}>
                        <i className="material-icons" style={{textDecoration: 'none', color: 'rgb(117, 117, 117)', fontSize: '21px'}}>delete_forever</i>
                        <ReactTooltip id="remove">Remove node</ReactTooltip>
                    </a>
                    }
                    </div>

                </div>
            );
        }

        let textAreaPlaceholder = '';

        if(node.uid === this.props.parentNodeId) {
            textAreaPlaceholder = 'Add the base premise of the argument';
        } else if(node['relativeToParent'] === 1) {
            textAreaPlaceholder = 'Add a statement that supports the above claim';
        } else if(node['relativeToParent'] === -1) {
            textAreaPlaceholder = 'Add a statement that opposes the above claim';
        }



        return (
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>

                <Modal
                    isOpen={this.state.sourceModalIsOpen}
                    onAfterOpen={this.afterOpenSourceModal.bind(this)}
                    onRequestClose={this.closeSourceModal.bind(this)}
                    style={signupModalStyles}
                    contentLabel="Source Modal"
                >
                    <Source source={this.props.node.source}
                            scriptId={this.props.scriptId}
                            user={this.props.user}
                            node={this.state.sourceSelectedNode}/>
                </Modal>

                <Modal
                    isOpen={this.state.fallacyModalIsOpen}
                    onAfterOpen={this.afterOpenFallacyModal.bind(this)}
                    onRequestClose={this.closeFallacyModal.bind(this)}
                    style={fallacyModalStyles}
                    contentLabel="Fallacy Modal"
                >
                    <Fallacy fallacy={this.props.node.fallacy}
                             scriptId={this.props.scriptId}
                             node={this.state.fallacySelectedNode}
                             user={this.props.user}/>
                </Modal>

                {/*<div className="circle"></div>*/}
                <div onMouseEnter={this.onNodeEnter.bind(this, this.props.node)} onMouseLeave={this.onNodeLeave.bind(this, this.props.node)} style={{
                    background: 'white',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    paddingTop: '10px',
                    paddingBottom: '3px',
                    borderRadius: '6px',
                    boxShadow: (this.state.highlighted? '2px 2px 6px #03a9f4': '1px 1px 4px rgba(0,0,0,.3)'),
                    zIndex: '100'
                }}>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <div style={{flex: 1}}>
                            {nodeHeader}
                        </div>
                        {/*{saveButton}*/}

                    </div>

                    <Textarea
                        id={this.props.node.uid}
                        key={this.props.node.uid}
                        placeholder={textAreaPlaceholder}
                        style={{resize: 'none', width: '300px', background: color}}
                        autoFocus={this.props.node.uid === this.state.selectedNode}
                        defaultValue={this.props.node.text}
                        value={this.state.lastUpdated < this.props.node.updatedTime? this.props.node.text: this.defaultValue}
                        readOnly={!this.props.canEdit}
                        onFocus={this.onFocus.bind(this, this.props.node)}
                        onBlur={this.onBlur.bind(this, this.props.node)}
                        onChange={this.onChange.bind(this, this.props.node)}
                        onClick={this.onTextAreaClick.bind(this, this.props.node)}
                    />


                    {this.props.node.source &&
                    <div style={{display: 'flex'}}>
                        <div
                            style={{
                                padding: '3px',
                                width: '300px',
                                wordWrap: 'break-word',
                                whiteSpace: 'pre-wrap',
                                textAlign: 'left',
                                fontSize: '13px'
                            }}>
                            { this.props.node.source.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi) ) &&
                                <div>
                                    <img style={{paddingRight: '3px', verticalAlign: 'middle'}} src={'https://www.google.com/s2/favicons?domain=' + this.props.node.source}/>
                                    <a data-tip data-for='source_link' style={{display: 'initial', border: 0, padding: 0, textDecoration: 'underline', color: '#1565c0'}} target="_blank" href={this.props.node.source}>{this.props.node.sourceMetadata.title? this.props.node.sourceMetadata.title: this.props.node.source}</a>
                                    <ReactTooltip id='source_link' effect='solid'>
                                        <span>{this.props.node.source}</span>
                                    </ReactTooltip>
                                </div>

                            }


                            { !this.props.node.source.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi) ) &&
                            <div>
                                <i className="material-icons" style={{verticalAlign: 'middle', textDecoration: 'none', color: '#1976d2', fontSize: '24px', marginRight: '3px'}}>link</i>
                                {this.props.node.source}
                            </div>
                            }
                        </div>
                    </div>
                    }

                    {this.props.node.fallacy &&
                    <div style={{display: 'flex'}}>
                        <i className="material-icons" style={{textDecoration: 'none', color: 'orange', fontSize: '24px', marginRight: '3px'}}>warning</i>
                        <div
                            style={{
                                padding: '3px',
                                width: '270px',
                                wordWrap: 'break-word',
                                whiteSpace: 'pre-wrap',
                                textAlign: 'left',
                                fontSize: '13px'
                            }}>
                            <span data-tip data-for='fallacy-description' style={{fontWeight: 'bold'}}>fallacy reported:</span> {this.props.node.fallacy.title}
                            <ReactTooltip id='fallacy-description' effect='solid'>
                                <span>{this.props.node.fallacy.shortDescription}</span>
                            </ReactTooltip>
                        </div>
                    </div>
                    }

                    {footer}

                </div>
            </div>
        )
    }



}

class Fragment extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }


    shallowEqual(objA, objB) {
        if (objA === objB) {
            return true;
        }

        if (typeof objA !== 'object' || objA === null ||
            typeof objB !== 'object' || objB === null) {
            return false;
        }

        var keysA = Object.keys(objA);
        var keysB = Object.keys(objB);

        if (keysA.length !== keysB.length) {
            return false;
        }

        // Test for A's keys different from B.
        var bHasOwnProperty = hasOwnProperty.bind(objB);
        for (var i = 0; i < keysA.length; i++) {
            if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
                return false;
            }
        }

        return true;
    }

    shallowCompare(instance, nextProps, nextState) {
        return (
            !this.shallowEqual(instance.props, nextProps) ||
            !this.shallowEqual(instance.state, nextState)
        );
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.shallowCompare(this, nextProps, nextState);
    }


    render() {

        if(this.props.data===undefined) {
            return null;
        }


        return (
            <ul>
                {

                    Object.keys(this.props.data).map(function(key, index) {

                        let node = this.props.data[key];

                        let currentNodeValue = 0;


                        if(this.props.premiseRelativeValue!==null||this.props.premiseRelativeValue!==undefined) {

                            currentNodeValue = this.props.premiseRelativeValue * node['relativeToParent'];

                            if(currentNodeValue===0 && this.props.premiseRelativeValue===1) {
                                currentNodeValue = -1;
                            }
                            else if(currentNodeValue===0 && this.props.premiseRelativeValue===-1) {
                                currentNodeValue = 1;
                            }
                        }


                        return (
                            <li key={node.uid}>
                                <Node node={node}
                                      uid={node.uid}
                                      scriptId={this.props.scriptId}
                                      user={this.props.user}
                                      premiseRelativeValue={this.props.premiseRelativeValue}
                                      parentNodeId={this.props.parentNodeId}
                                      setHighlightedNode={this.props.setHighlightedNode}
                                      setHotkeysEnabledFlag={this.props.setHotkeysEnabledFlag}
                                      canEdit={this.props.canEdit}/>
                                {(node.children!==undefined && Object.keys(node.children).length > 0) &&
                                <Fragment user={this.props.user}
                                          data={node.children}
                                          parentNodeId={this.props.parentNodeId}
                                          scriptId={this.props.scriptId}
                                          premiseRelativeValue={currentNodeValue}
                                          setHighlightedNode={this.props.setHighlightedNode}
                                          setHotkeysEnabledFlag={this.props.setHotkeysEnabledFlag}
                                          canEdit={this.props.canEdit}/>}
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
            accountDeletionMessage: '',
            accountDeletionMessageColor: ''
        };
    }

    componentWillMount() {
        document.body.style.backgroundColor = "#e9ebee";
    }

    componentDidMount() {
        document.title = 'Profile';
        store.dispatch({type: 'SET_ACTIVE_SCRIPT_ID', activeScriptId: null})
    }

    onDeleteAccountSubmit() {
        this.setState({showConfirmDeletion: true});
    }

    onCancelDeletionClick() {
        this.setState({showConfirmDeletion: false, deletionConfirmPassword: '', accountDeletionMessage: '', accountDeletionMessageColor: ''})
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


            db.collection("users").doc(this.props.user.uid).collection('scripts')
                .where('creator', '==', true).get().then(function(querySnapshot) {
                let counter = 0;

                if(querySnapshot.size===0) {

                    db.collection("users").doc(this.props.user.uid).delete().then(function() {

                        user.delete().then(function() {
                            this.props.history.push('/');
                            window.location.reload();
                        }.bind(this)).catch(function(error) {
                            // An error happened.
                        });

                    }.bind(this)).catch(function(error) {
                        console.error("Error removing user document: ", error);
                    });
                }

                querySnapshot.forEach(function(script) {
                    counter++;

                    db.collection("scripts").doc(script.id).delete().then(function() {
                    }.bind(this)).catch(function(error) {
                        console.error("Error removing document: ", error);
                    }.bind(this));

                    if(counter===querySnapshot.size) {

                        db.collection("users").doc(this.props.user.uid).delete().then(function() {

                            user.delete().then(function() {
                                this.props.history.push('/');
                                window.location.reload();
                            }.bind(this)).catch(function(error) {
                                // An error happened.
                            });

                        }.bind(this)).catch(function(error) {
                            console.error("Error removing user document: ", error);
                        });
                    }
                }.bind(this));

            }.bind(this));


                // User deleted.

        }.bind(this)).catch(function(error) {
            this.setState({accountDeletionMessage: error.message, accountDeletionMessageColor: 'red'});
            console.log('error:', error)
            // An error happened.
        }.bind(this));


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
            <div style={{marginTop: '75px', display: 'flex', justifyContent: 'center'}}>
                <div style={{width: '400px', padding: '20px', display: 'flex', flexDirection: 'column', background: 'white', boxShadow: '1px 1px 4px rgba(0,0,0,.3)'}}>
                    <div style={{alignSelf: 'center', fontSize: '20px', color: '#0d47a1', marginBottom: '25px'}}>profile</div>

                    { this.props.user.email && <div style={{display: 'flex', flexDirection: 'row', padding: '5px'}}>
                        <div style={{flex: 1}}>email</div>
                        <div style={{flex: 1}}>{this.props.user.email}</div>
                    </div>}

                    <div style={{display: 'flex', flexDirection: 'row', padding: '5px'}}>
                    <div style={{flex: 1}}>username</div>
                    <div style={{flex: 1}}>{this.props.user.username}</div>
                    </div>

                    <div style={{display: 'flex', flexDirection: 'row', padding: '5px'}}>
                        <div style={{flex: 1}}>password</div>
                        <div onClick={this.onPasswordChangeClick.bind(this)} style={{flex: 1, color: '#0d47a1', cursor: 'pointer', textDecoration: 'underline', fontSize: '15px'}}>change</div>
                    </div>
                {this.state.showChangePassword &&
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <input style={{width: '200px', height: '25px', fontSize: '14px'}} type="password" placeholder="enter old password" value={this.state.oldPassword}
                               onChange={this.handleOldPasswordChange.bind(this)}/>
                        <input style={{width: '200px', height: '25px', fontSize: '14px'}} type="password" placeholder="enter new password" value={this.state.newPassword}
                               onChange={this.handleNewPasswordChange.bind(this)}/>

                        <div style={{marginBottom: '5px'}}>
                            <button style={{margin: '5px', borderRadius: '5px', width: '64px', fontSize: '13px', height: '24px', background: '#1565c0', borderColor: 'transparent', color: '#fff',cursor: 'pointer' }} onClick={this.onConfirmPasswordChangeClick.bind(this)}>Confirm</button>
                            <button style={{margin: '5px', borderRadius: '5px', width: '60px', fontSize: '13px', height: '20px', background: 'white', borderColor: 'transparent', color: 'black', textDecoration: 'underline', cursor: 'pointer' }} onClick={this.onCancelPasswordChangeClick.bind(this)}>Cancel</button>
                        </div>
                    </div>
                }

                <button onClick={this.onDeleteAccountSubmit.bind(this)} style={{margin: '10px', alignSelf: 'center', borderRadius: '10px', width: '200px', fontSize: '14px', height: '30px', background: '#b71c1c', borderColor: 'transparent', color: '#fff',cursor: 'pointer' }} type="button" value="Submit">delete account</button>
                {this.state.showConfirmDeletion &&
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        enter password to confirm deletion
                        <input style={{width: '200px', marginTop: '5px', height: '25px', fontSize: '14px'}} type="password" placeholder="enter password" value={this.state.deletionConfirmPassword}
                               onChange={this.handleDeletionConfirmPasswordChange.bind(this)}/>
                     <div>
                        <button style={{margin: '5px', borderRadius: '5px', width: '64px', fontSize: '13px', height: '24px', background: '#b71c1c', borderColor: 'transparent', color: '#fff',cursor: 'pointer' }} onClick={this.onConfirmDeletionClick.bind(this)}>Confirm</button>
                        <button style={{margin: '5px', borderRadius: '5px', width: '60px', fontSize: '13px', height: '20px', background: 'white', borderColor: 'transparent', color: 'black', textDecoration: 'underline', cursor: 'pointer' }} onClick={this.onCancelDeletionClick.bind(this)}>Cancel</button>
                     </div>
                    <div style={{color: this.state.accountDeletionMessageColor}}>{this.state.accountDeletionMessage}</div>
                    </div>

                }
                </div>
            </div>
        )
    }


}


class DeleteScript extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            deleteScriptInProgress: false,
            error: ''
        };
    }


    deleteScript(userId, scriptId, closeDeleteScript, evt) {
        evt.preventDefault();
        this.setState({deleteScriptInProgress: true});
        db.collection("scripts").doc(scriptId).delete().then(function() {
            console.log("Document successfully deleted from /scripts");

            db.collection("users").doc(userId).collection('scripts').doc(scriptId).delete().then(function() {
                console.log("Document successfully deleted from /users/scripts");
                //TODO: removing collaborators
                closeDeleteScript();
            }).catch(function(error) {
                this.setState({error: 'an unexpected error has occurred.'});
                console.error("Error removing document from /users/scripts: ", error);
            }.bind(this));


        }).catch(function(error) {
            this.setState({error: 'an unexpected error has occurred.'});
            console.error("Error removing document from /scripts: ", error);
        });
    }



    render() {
        return (
            <div style={{width: '350px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px'}}>
                <div style={{margin: '15px'}}>Are you sure you want to delete '{this.props.scriptTitle}'? </div>

                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <button onClick={this.deleteScript.bind(this, this.props.userId, this.props.scriptId, this.props.closeDeleteScript)} style={{margin: '10px', borderRadius: '10px', width: '64px', fontSize: '14px', height: '30px', background: '#b71c1c', borderColor: 'transparent', color: '#fff',cursor: 'pointer' }} >confirm</button>
                    <button onClick={this.props.closeDeleteScript} style={{margin: '10px', borderRadius: '10px', width: '64px', fontSize: '14px', height: '30px', background: 'white', borderColor: 'black', color: 'black',cursor: 'pointer' }} >cancel</button>
                </div>
                {this.state.deleteScriptInProgress && <div style={{display: 'flex', justifyContent: 'center', paddingLeft: '50px', paddingRight: '50px', marginTop: '5px'}}>
                    <svg className="spinner" width="30px" height="30px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                        <circle className="path" fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"/>
                    </svg>
                </div>}

                <div>
                    {this.state.error}
                </div>

            </div>
        )
    }


}



class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            createScriptModalIsOpen: false,
            deleteScriptConfirmationModalIsOpen: false,
            selectedDeleteScriptId: '',
            selectedDeleteScriptTitle: '',
            userId: '',
            numScripts: 0
        };
    }

    componentWillMount() {
        document.body.style.backgroundColor = "#e9ebee";
    }

    componentDidMount() {
        document.title = 'Home';
        store.dispatch({type: 'SET_ACTIVE_SCRIPT_ID', activeScriptId: null})

        store.subscribe(() => {
                this.setState({numScripts: store.getState().numScripts})
            }
        )

    }

    createNewScript() {

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

                db.collection('scripts').doc(scriptRef.id).update({uid: scriptRef.id}).then(function (nodeRef) {
                }).catch(function (err) {
                    console.log(err)
                });

                let permissionObj = {};
                permissionObj['permission'] = 'write';
                permissionObj['uid'] = this.props.user.uid;
                permissionObj['email'] =  this.props.user.email;
                permissionObj['username'] =  this.props.user.username;
                permissionObj['isOwner'] = true;

                db.collection('scripts').doc(scriptRef.id).collection('collaborators').doc(this.props.user.uid).set(permissionObj).then(function (nodeRef) {
                }).catch(function (err) {
                    console.log(err)
                });

                db.collection('scripts').doc(scriptRef.id).collection('nodes').add({
                    text: ''
                })
                    .then(function (nodeRef) {

                        var nodeId = nodeRef.id;
                        var scriptId = scriptRef.id;

                        db.collection('scripts').doc(scriptRef.id).update({parentNodeId: nodeRef.id}).then(function (nodeRef) {


                            db.collection('scripts').doc(scriptId).collection('nodes').doc(nodeId).update({
                                parentUid: null,
                                relativeToParent: 1,
                                uid: nodeId,
                                text: '',
                                createdTime: Date.now(),
                                updatedTime: Date.now()
                            }).then(function (nodeRef) {


                                db.collection('users').doc(this.props.user.uid).collection('scripts').doc(scriptId).set({
                                    creator: true,
                                    collaborator: true,
                                    forked: false,
                                    uid: scriptId,
                                    createdTime: Date.now(),
                                    updatedTime: Date.now(),
                                    title: 'Untitled'
                                }).then(function (nodeRef) {

                                    store.dispatch({type: 'SCRIPT_CREATION_FINISHED', isScriptCreation: false});
                                    this.props.history.push('/s/' + scriptId);
                                    window.location.reload();


                                }.bind(this)).catch(function (err) {
                                    console.log(err)
                                });




                            }.bind(this)).catch(function (err) {
                                console.log('error in script creation:',err)
                            });




                        }.bind(this)).catch(function (err) {
                            console.log(err)
                        });



                    }.bind(this))

            }.bind(this))
            .catch(function(error) {
                store.dispatch({type: 'SCRIPT_CREATION_FINISHED', isScriptCreation: false});
                console.error("Error adding document: ", error);
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

    openCreateScriptModal() {
        this.setState({createScriptModalIsOpen: true})
    }


    closeCreateScriptModal() {
        this.setState({createScriptModalIsOpen: false})
    }


    onCreateNewScriptClick() {
        this.setState({createScriptModalIsOpen: true})
    }


    openDeleteScriptConfirmationModal() {
        this.setState({deleteScriptConfirmationModalIsOpen: true})
    }


    closeDeleteScriptConfirmationModal() {
        this.setState({deleteScriptConfirmationModalIsOpen: false})
    }


    onScriptDeleteClick(uid, scriptId, title, evt) {
        evt.preventDefault();
        this.setState({deleteScriptConfirmationModalIsOpen: true, selectedDeleteScriptId: scriptId, userId: uid, selectedDeleteScriptTitle: title })
    }


    render() {

        const SCRIPT_ROUTE = (scriptId) => `/s/${scriptId}/`;

        let scriptHeaderFragment = (<div></div>);

        let initFragment = (
            <Col xs={12} sm={3} md={2} lg={1}  style={{marginBottom: '80px', marginLeft: '80px', marginRight: '80px'}}>
                {/*<Link activeStyle={{}} to={SCRIPT_ROUTE(this.props.scriptHeaders[key].uid)} style={{textDecoration: 'none'}} params={{scriptId: this.props.scriptHeaders[key].uid}}>*/}
                    <div onClick={this.openCreateScriptModal.bind(this)} style={{cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems:"center",justifyContent:"center", width: 200, height: 225, background: 'white', boxShadow: '1px 1px 4px rgba(0,0,0,.3)'}} key={123}>
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

        if(!store.getState().scriptFetchComplete || this.state.numScripts>0) {
            initFragment = null;
        }




        if(this.props.scriptHeaders!==undefined) {

            if(Object.keys(this.props.scriptHeaders).length>0) {
                initFragment = null;
            }

            let timeIndexedScriptList = Object.keys(this.props.scriptHeaders)
                .reduce((obj, objKey) => {
                    obj[this.props.scriptHeaders[objKey].updatedTime] = this.props.scriptHeaders[objKey];
                    return obj;
                }, {});


            let intTimeArray = Object.keys(timeIndexedScriptList).map(stringTime => parseInt(stringTime));
            let sortedObj = intTimeArray.sort((a, b) => b - a);

            scriptHeaderFragment = (sortedObj.map(function(key) {
                return (
                    <Col key={timeIndexedScriptList[key].uid} xs={12} sm={3} md={2} lg={1}  style={{marginBottom: '80px', marginLeft: '80px', marginRight: '80px'}}>
                        <Link to={SCRIPT_ROUTE(timeIndexedScriptList[key].uid)} style={{textDecoration: 'none'}} params={{scriptId: timeIndexedScriptList[key].uid}}>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems:"center",justifyContent:"center", width: 200, height: 225, background: 'white', boxShadow: '1px 1px 4px rgba(0,0,0,.3)'}} key={timeIndexedScriptList[key].uid}>
                                <div style={{display: 'flex', flex: 3,width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                                    <div>
                                    <img style={{width: 80, height: 80}} src={argumentLogo}></img>
                                    </div>
                                </div>

                                <div style={{display: 'flex', flex: 1, flexDirection: 'row', width: '100%'}}>
                                    <div style={{display: 'flex', flexDirection: 'column', flex: 5, marginLeft: '15px'}}>
                                        <div style={{marginBottom: '4px', width: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '15px', fontWeight: '600', color: '#373737'}}>
                                        {timeIndexedScriptList[key].title}
                                        </div>
                                        <div style={{display: 'flex', flexDirection: 'row'}}>
                                            <img style={{width: 20, height: 20, marginRight: '3px'}} src={argumentLogo}></img>
                                            <div style={{fontSize: '10.5px', fontWeight: '300', color: '#373737'}}>
                                                updated {this.timeSince(timeIndexedScriptList[key].updatedTime)} ago
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{flex: 1, alignSelf: 'center'}}>
                                            <i onClick={this.onScriptDeleteClick.bind(this, this.props.user.uid, timeIndexedScriptList[key].uid,  timeIndexedScriptList[key].title)}
                                               className="material-icons"
                                               style={{textDecoration: 'none', color: 'rgb(117, 117, 117)', fontSize: '20px'}}>
                                                delete_forever</i>
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
                <Modal
                    isOpen={this.state.createScriptModalIsOpen}
                    onRequestClose={this.closeCreateScriptModal.bind(this)}
                    style={signupModalStyles}
                    contentLabel="Loader Modal"
                >
                    <Route render={(props) => ( <ScriptList {...props} user={this.props.user} closeCreateScript={this.closeCreateScriptModal.bind(this)}/> )} />
                </Modal>

                <Modal
                    isOpen={this.state.deleteScriptConfirmationModalIsOpen}
                    onRequestClose={this.closeDeleteScriptConfirmationModal.bind(this)}
                    style={signupModalStyles}
                    contentLabel="Loader Modal"
                >
                    <Route render={(props) => ( <DeleteScript {...props} userId={this.state.userId}
                                                              scriptId={this.state.selectedDeleteScriptId}
                                                              scriptTitle={this.state.selectedDeleteScriptTitle}
                                                              closeDeleteScript={this.closeDeleteScriptConfirmationModal.bind(this)}/> )} />
                </Modal>

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

                <Route render={(props) => ( <Header {...props } scriptHeaders={this.props.scriptHeaders} user={this.props.user} onClick={this.handleViewSidebar.bind(this)} /> )} />

                <Route render={(props) => ( this.props.user ? <SideBar {...props} isOpen={this.state.sidebarOpen} disableSidebar={this.disableSidebar.bind(this)} user={this.props.user}/> : null)}/>

                <Switch>
                    <Route exact path="/s/:scriptId" render={(props) => (
                        <Editor
                            {...props}
                            user={this.props.user}
                            disableSidebar={this.disableSidebar.bind(this)}
                            scriptHeaders={this.props.scriptHeaders}
                            isOpen={this.state.sidebarOpen}/>
                    )} />
                    <Route exact path="/" render={(props) => ( this.props.user ? <Home {...props} user={this.props.user} scriptIds={this.props.scriptIds} scriptHeaders={this.props.scriptHeaders}/> : <Redirect to="/" />)}/>
                    <Route exact path="/profile" render={(props) => ( this.props.user ? <Profile {...props} user={this.props.user} /> : <Redirect to="/" />)}/>
                    <Route exact path="/terms" render={(props) => (<Terms/>)}/>
                    <Route exact path="/privacy" render={(props) => (<Privacy/>)}/>
                    <Route component={NoMatch}/>
                </Switch>
            </div>
        );
    }
}

const LogoutButton = withRouter(({ history }) => (

    <div style={{display: 'flex', paddingLeft: '50px', height: '40px', alignItems: 'center'}}>
        <i className="material-icons" style={{textDecoration: 'none', color: '#7f0000', fontSize: '32px'}}>power_settings_new</i>
        <Link to="/" style={{ color: '#7f0000', textDecoration: 'none', fontSize: '17px', paddingLeft: '5px' }} onClick={() => {
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
            email: '',
            message: '',
            messageColor: ''
        };
    }

    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    send() {
        var auth = firebase.auth();

        auth.sendPasswordResetEmail(this.state.email).then(function() {
            this.setState({message: 'verification mail sent.', messageColor: 'green'});
            console.log('email sent')
            // Email sent.
        }.bind(this)).catch(function(error) {
            this.setState({message: error.message, messageColor: 'red'});
            // An error happened.
        }.bind(this));
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
            <div style={{width: '350px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px'}}>
                <div style={{padding: '10px', color: '#0d47a1'}}>Password reset</div>
                <div style={{padding: '10px'}}>Please enter your email. We will send you an email to reset your password.</div>
                <input style={{width: '250px', fontSize: '14px'}} type="email" placeholder="email" required value={this.state.email}
                       onChange={this.handleEmailChange.bind(this)}/>
                <div style={{color: this.state.messageColor}}>{this.state.message}</div>

                <button
                    style={{margin: '10px',
                        borderRadius: '10px',
                        width: '60px',
                        fontSize: '14px',
                        height: '30px',
                        background: '#1565c0',
                        borderColor: 'transparent',
                        color: '#fff',
                        cursor: 'pointer' }}
                    onClick={this.send.bind(this)}>
                    send
                </button>
                <button
                    style={{margin: '10px',
                        borderRadius: '10px',
                        width: '60px',
                        fontSize: '14px',
                        height: '30px',
                        background: 'red',
                        borderColor: 'transparent',
                        color: '#fff',
                        cursor: 'pointer' }}
                    onClick={this.props.closeModal}>
                    cancel
                </button>
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
            noteModalIsOpen: false,
            activeScriptId: null,
            title: '',
            collaborators: {},
            shareUsernameField: '',
            permissionValue: 'read-only',
            shareModalMessage: '',
            timer: null,
            forgotPasswordModalIsOpen: false,
            isConnected: true
        };

        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

        this.openLoaderModal = this.openLoaderModal.bind(this);
        this.afterOpenLoaderModal = this.afterOpenLoaderModal.bind(this);
        this.closeLoaderModal = this.closeLoaderModal.bind(this);
    }

    componentDidMount() {


        var connectedRef = firebase.database().ref(".info/connected");
        connectedRef.on("value", function(snap) {
            if (snap.val() === true) {
                this.setState({isConnected: true})
            } else {
                this.setState({isConnected: false})
            }
        }.bind(this));


        store.subscribe(() => {
            this.setState({activeScriptId: store.getState().activeScriptId, title: store.getState().title, loaderModalIsOpen: store.getState().isScriptCreation})

            if(store.getState().activeScriptId) {

                db.collection('scripts').doc(store.getState().activeScriptId).collection('collaborators').onSnapshot(function (querySnapshot) {
                    let collaborators = {};
                    querySnapshot.forEach(function (doc) {
                        collaborators[doc.id] = doc.data();

                    }.bind(this));

                    this.setState({collaborators: collaborators})

                    }.bind(this), function(error){
                    console.log('header collab fetch error:', error)
                });

                db.collection('scripts').doc(store.getState().activeScriptId).onSnapshot(function (doc) {
                    if(doc.exists) {
                        this.setState({scope: doc.data().scope})
                    }
                }.bind(this), function(error){
                    console.log('header scope fetch error:', error)
                })

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


        if(props.scriptHeaders && this.state.activeScriptId) {
            let scriptList = Object.keys(props.scriptHeaders);
            if (!scriptList.includes(this.state.activeScriptId)) {
                store.dispatch({type: 'SET_ACTIVE_SCRIPT_ID', activeScriptId: null})
            }
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
        store.dispatch({type: 'SET_HOTKEYS_ENABLED_FLAG', hotkeysEnabled: false});
        document.body.style.overflow = "hidden";
        // references are now sync'd and can be accessed.
        // this.subtitle.style.color = 'black';
    }

    closeModal() {
        document.body.style.overflow = "auto";
        store.dispatch({type: 'SET_HOTKEYS_ENABLED_FLAG', hotkeysEnabled: true});
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

        let helloUserUrl = 'https://us-central1-argument-app.cloudfunctions.net/app/addCollaborator';
        // let helloUserUrl = 'http://localhost:5000/argument-app/us-central1/app/addCollaborator';

        let id = username;
        let type = 'username';
        let params = "id=" + id + "&" + "type=" + type + "&" + "scriptId=" + activeScriptId + "&" + "accessLevel=" + permission;

        firebase.auth().currentUser.getToken().then(function(token) {
            var req = new XMLHttpRequest();
            req.onload = function() {
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
            evt.preventDefault();
        }
    }

    onTitleFocus(evt) {
        store.dispatch({type: 'SET_HOTKEYS_ENABLED_FLAG', hotkeysEnabled: false});
    }


    onTitleBlur(evt) {
        store.dispatch({type: 'SET_HOTKEYS_ENABLED_FLAG', hotkeysEnabled: true});
    }

    onChange = (evt) => {
        // console.log('value:', evt.target.value)
        // console.log(node)
        this.setState({text: evt.target.value})

        clearTimeout(this.timer);

        this.setState({ value: 100 });

        this.timer = setTimeout(this.triggerChange.bind(this), 1000);


    }


    triggerChange() {

        let domNode = ReactDOM.findDOMNode(this.refs.title);

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


    removePartner(userId, scriptId, isOwner) {

        let helloUserUrl = 'https://us-central1-argument-app.cloudfunctions.net/app/removeCollaborator';
        // let helloUserUrl = 'http://localhost:5000/argument-app/us-central1/app/removeCollaborator';

        let params = "userId=" + userId + "&" + "scriptId=" + scriptId;

        firebase.auth().currentUser.getToken().then(function(token) {
            console.log('Sending request to', helloUserUrl + "?" + params, 'with ID token in Authorization header.');
            var req = new XMLHttpRequest();
            req.onload = function() {
                console.log('onload;', req.responseText);
                if(!isOwner) {
                    this.props.history.push('/');
                    window.location.reload();
                }
                else {
                    let newCollabObj = Object.keys(this.state.collaborators)
                        .filter( objKey => objKey !== userId)
                        .reduce((obj, objKey) => {
                            obj[objKey] = this.state.collaborators[objKey];
                            return obj;
                        }, {});


                    this.setState({collaborators: newCollabObj});

                }
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

    removeCollaborator(key, isOwner) {
        this.removePartner(key, this.state.activeScriptId, isOwner);
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

    onAddNoteClick() {
        this.setState({noteModalIsOpen: true});
    }

    afterOpenNoteModal() {
        store.dispatch({type: 'SET_HOTKEYS_ENABLED_FLAG', hotkeysEnabled: false});
        document.body.style.overflow = "hidden";
        // references are now sync'd and can be accessed.
        // this.subtitle.style.color = 'black';
    }

    closeNoteModal() {
        document.body.style.overflow = "auto";
        store.dispatch({type: 'SET_HOTKEYS_ENABLED_FLAG', hotkeysEnabled: true});
        this.setState({noteModalIsOpen: false});
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
                    <div key={key} style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
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
                                <a href="javascript:;" onClick={this.removeCollaborator.bind(this, key, this.state.collaborators[this.props.user.uid]['isOwner']  )}
                                   title="remove collaborator">
                                    <i className="material-icons"
                                       style={{textDecoration: 'none', color: 'rgb(117, 117, 117)', fontSize: '20px'}}>remove_circle</i>
                                </a>
                            </div> : <div style={{width: '20px'}}></div>
                        }


                    </div>
                );
            }.bind(this)));

            let isEditable = false;
            if(this.props.user) {
                if(this.state.collaborators[this.props.user.uid]) {
                    if(this.state.collaborators[this.props.user.uid]['isOwner']) {
                        isEditable = true;
                    }
                }
            }
            headerSubSection = (
                <div style={{display: 'flex', flex: 1, flexDirection: 'row',  alignItems: 'center', justifyContent: 'center'}}>

                    <div style={{display: 'flex', flex: 1,  alignItems: 'center', justifyContent: 'center'}}>
                        <span data-tip data-for='title'
                              suppressContentEditableWarning={true}
                              ref="title" onInput={this.onChange.bind(this)}
                              onKeyPress={this.onTitleHitEnter.bind(this)}
                              contentEditable={isEditable}
                              onFocus={this.onTitleFocus.bind(this)}
                              onBlur={this.onTitleBlur.bind(this)}
                              style={{padding: '5px',
                                  minWidth: '50px',
                                  maxWidth: '500px',
                                  fontSize: '18px',
                                  overflow: 'hidden',
                                  whiteSpace: 'nowrap'}}>
                            {this.state.title}
                        </span>
                        <ReactTooltip id="title">Edit title</ReactTooltip>

                        { Object.keys(this.state.collaborators).length > 0 && this.props.scriptHeaders && this.state.activeScriptId &&
                        <a data-tip data-for='note' style={{
                            padding: 0,
                            border: 'none',
                            display: 'flex',
                            marginLeft: '15px',
                            textDecoration: 'none',
                            outline: 'none'
                        }} href="javascript:;" onClick={this.onAddNoteClick.bind(this)}>
                            <i className="material-icons"
                               style={{textDecoration: 'none', color: 'rgb(117, 117, 117)', fontSize: '24px'}}>note</i>
                            <ReactTooltip id="note">Add note</ReactTooltip>
                        </a>

                        }

                        { Object.keys(this.state.collaborators).length > 0 && this.props.scriptHeaders && this.state.activeScriptId &&
                        <Modal
                            isOpen={this.state.noteModalIsOpen}
                            onAfterOpen={this.afterOpenNoteModal}
                            onRequestClose={this.closeNoteModal.bind(this)}
                            style={noteModalStyles}
                            contentLabel="Note Modal"
                        >
                            <Note note={this.props.scriptHeaders[this.state.activeScriptId]['note']}
                                  script={this.props.scriptHeaders[this.state.activeScriptId]}
                                  scriptId={this.state.activeScriptId}
                                  user={this.props.user}/>
                        </Modal>
                        }


                    </div>

                    <div style={{flex: 0, marginRight: '32px'}}>
                        <Modal
                            isOpen={this.state.modalIsOpen}
                            onAfterOpen={this.afterOpenModal}
                            onRequestClose={this.closeModal}
                            style={shareModalStyles}
                            contentLabel="Example Modal"
                        >
                            { !this.props.user.isAnonymous && <div>
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
                            </div> }

                            { this.props.user.isAnonymous && <div>
                                sorry, share feature is not available in the anonymous mode
                            </div>


                            }
                        </Modal>

                        { Object.keys(this.state.collaborators).length>0 &&
                            <div data-tip data-for='share' onClick={this.openModal} style={{
                                padding: '8px',
                                borderRadius: '2px',
                                borderColor: '#1565c0',
                                display: 'flex',
                                flex: 1,
                                alignItems: 'center',
                                background: '#1565c0',
                                color: 'white',
                                cursor: 'pointer',
                                flexDirection: 'row'
                            }}>
                                <img style={{flex: 1, width: 12, height: 12}} src={shareIcon}></img>
                                <div style={{flex: 1, paddingLeft: '5px', paddingRight: '5px', fontSize: '12px'}}>
                                    Share
                                </div>
                                <ReactTooltip id="share">Share settings</ReactTooltip>
                            </div>
                        }

                    </div>

                </div>
            );


        }



        var re = new RegExp("^/s/", "i");

        let titleSection = null;

        if(re.test(this.props.location.pathname) && this.props.user===null) {
            titleSection = (<div style={{display: 'flex', flex: 1, flexDirection: 'row',  alignItems: 'center', justifyContent: 'center'}}>

                <div style={{display: 'flex', flex: 1,  alignItems: 'center', justifyContent: 'center'}}>
                    <span suppressContentEditableWarning={true} ref="title" onInput={this.onChange.bind(this)} onKeyPress={this.onTitleHitEnter.bind(this)} contentEditable="false" style={{padding: '5px', minWidth: '50px', maxWidth: '500px', fontSize: '18px', overflow: 'hidden', whiteSpace: 'nowrap'}}>{this.state.title}</span>
                </div>
            </div>);
        }

        if(!re.test(this.props.location.pathname)) {
            headerSubSection = (
                <div style={{flex: 1}}>

                </div>
            );
        }


        return (
            <div>
            <div className='header' style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center'}}>
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

                {titleSection}

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
                </div>
            </div>
                { (!this.state.isConnected && false) &&
                    <div className="isConnected"
                         style={{top: 0, display: 'flex', justifyContent: 'center', color: 'white', backgroundColor: '#f57f17'}}>
                        <i className="material-icons" style={{textDecoration: 'none', color: 'white', fontSize: '20px'}}>warning</i>
                        not
                        connected to the internet</div>
                }
            </div>
        );
    }
}

class ScriptList extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {

        };
    }

    createNewScript() {

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

                db.collection('scripts').doc(scriptRef.id).update({uid: scriptRef.id}).then(function (nodeRef) {
                    console.log('script id added.')
                }).catch(function (err) {
                    console.log(err)
                });

                let permissionObj = {};
                permissionObj['permission'] = 'write';
                permissionObj['uid'] = this.props.user.uid;
                permissionObj['email'] =  this.props.user.email;
                permissionObj['username'] =  this.props.user.username;
                permissionObj['isOwner'] = true;

                db.collection('scripts').doc(scriptRef.id).collection('collaborators').doc(this.props.user.uid).set(permissionObj).then(function (nodeRef) {
                }).catch(function (err) {
                    console.log(err)
                });

                db.collection('scripts').doc(scriptRef.id).collection('nodes').add({
                    text: ''
                })
                    .then(function (nodeRef) {

                        var nodeId = nodeRef.id;
                        var scriptId = scriptRef.id;

                        db.collection('scripts').doc(scriptRef.id).update({parentNodeId: nodeRef.id}).then(function (nodeRef) {


                            db.collection('scripts').doc(scriptId).collection('nodes').doc(nodeId).update({
                                parentUid: null,
                                relativeToParent: 1,
                                uid: nodeId,
                                text: '',
                                createdTime: Date.now(),
                                updatedTime: Date.now()
                            }).then(function (nodeRef) {


                                db.collection('users').doc(this.props.user.uid).collection('scripts').doc(scriptId).set({
                                    creator: true,
                                    collaborator: true,
                                    forked: false,
                                    uid: scriptId,
                                    createdTime: Date.now(),
                                    updatedTime: Date.now(),
                                    title: 'Untitled'
                                }).then(function (nodeRef) {

                                    store.dispatch({type: 'SCRIPT_CREATION_FINISHED', isScriptCreation: false});
                                    this.props.history.push('/s/' + scriptId);
                                    window.location.reload();


                                }.bind(this)).catch(function (err) {
                                    console.log(err)
                                });




                            }.bind(this)).catch(function (err) {
                                console.log('error in script creation:',err)
                            });




                        }.bind(this)).catch(function (err) {
                            console.log(err)
                        });



                    }.bind(this))

            }.bind(this))
            .catch(function(error) {
                store.dispatch({type: 'SCRIPT_CREATION_FINISHED', isScriptCreation: false});
                console.error("Error adding document: ", error);
            });
    }

    render() {
        return (
            <div style={{width: '350px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px'}}>
            <div style={{margin: '15px'}}>select the type of script to create</div>

                <div onClick={this.createNewScript.bind(this)} style={{cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems:"center",justifyContent:"center", width: 100, height: 112, background: 'white', boxShadow: '1px 1px 4px rgba(0,0,0,.3)'}} key={123}>
                    <div style={{display: 'flex', flex: 3, paddingTop: '10px'}}>
                        <img style={{width: 65, height: 65}} src={argumentLogo}></img>
                    </div>
                    <div style={{display: 'flex', flex: 1, color: '#555555', fontSize: '15px', marginBottom: '4px'}}>
                       Argument
                    </div>
                    {/*{this.props.scriptHeaders[id]['uid']}*/}
                    {/*{this.props.scriptHeaders[key].title}*/}
                    {/*<a href="javascript:;" onClick={this.deleteScript.bind(this, this.props.user.uid, this.props.scriptHeaders[key].uid)}>*/}
                    {/*<i className="material-icons" style={{textDecoration: 'none', color: 'rgb(117, 117, 117)', fontSize: '20px'}}>delete_forever</i>*/}
                    {/*</a>*/}
                </div>
            </div>
        )
    }


}

class SideBar extends Component{

    constructor(props, context) {
        super(props, context);

        this.state = {
            isOpen: false,
            isInternalLinkClicked: false,
            createScriptModalIsOpen: false
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

    openCreateScriptModal() {
        this.setState({createScriptModalIsOpen: true})
    }


    closeCreateScriptModal() {
        this.setState({createScriptModalIsOpen: false})
    }


    onCreateNewScriptClick() {
        this.setState({createScriptModalIsOpen: true})
    }




    createNewScript() {

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

                db.collection('scripts').doc(scriptRef.id).update({uid: scriptRef.id}).then(function (nodeRef) {
                    console.log('script id added.')
                }).catch(function (err) {
                    console.log(err)
                });

                let permissionObj = {};
                permissionObj['permission'] = 'write';
                permissionObj['uid'] = this.props.user.uid;
                permissionObj['email'] =  this.props.user.email;
                permissionObj['username'] =  this.props.user.username;
                permissionObj['isOwner'] = true;

                db.collection('scripts').doc(scriptRef.id).collection('collaborators').doc(this.props.user.uid).set(permissionObj).then(function (nodeRef) {
                }).catch(function (err) {
                    console.log(err)
                });

                db.collection('scripts').doc(scriptRef.id).collection('nodes').add({
                    text: ''
                })
                    .then(function (nodeRef) {

                        var nodeId = nodeRef.id;
                        var scriptId = scriptRef.id;

                        db.collection('scripts').doc(scriptRef.id).update({parentNodeId: nodeRef.id}).then(function (nodeRef) {


                            db.collection('scripts').doc(scriptId).collection('nodes').doc(nodeId).update({
                                parentUid: null,
                                relativeToParent: 1,
                                uid: nodeId,
                                text: '',
                                createdTime: Date.now(),
                                updatedTime: Date.now()
                            }).then(function (nodeRef) {


                                db.collection('users').doc(this.props.user.uid).collection('scripts').doc(scriptId).set({
                                    creator: true,
                                    collaborator: true,
                                    forked: false,
                                    uid: scriptId,
                                    createdTime: Date.now(),
                                    updatedTime: Date.now(),
                                    title: 'Untitled'
                                }).then(function (nodeRef) {

                                    store.dispatch({type: 'SCRIPT_CREATION_FINISHED', isScriptCreation: false});
                                    this.props.history.push('/s/' + scriptId);
                                    window.location.reload();


                                }.bind(this)).catch(function (err) {
                                    console.log(err)
                                });




                            }.bind(this)).catch(function (err) {
                                console.log('error in script creation:',err)
                            });




                        }.bind(this)).catch(function (err) {
                            console.log(err)
                        });



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

                <Modal
                    isOpen={this.state.createScriptModalIsOpen}
                    onRequestClose={this.closeCreateScriptModal.bind(this)}
                    style={signupModalStyles}
                    contentLabel="Loader Modal"
                >
                    <Route render={(props) => ( <ScriptList {...props} user={this.props.user} closeCreateScript={this.closeCreateScriptModal.bind(this)}/> )} />
                </Modal>

                <div style={{flex: 1}}>
                    <div style={{marginTop: '10px', marginBottom: '24px', height: '64px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <img style={{width: 40, height: 40, padding: '5px'}} src={scripptLogo}></img>
                        <div style={{opacity: '.55', fontSize: '22px'}}>
                        Scrippt
                        </div>
                        <sup style={{opacity: 0.5}}> beta</sup>
                    </div>

                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40px', marginBottom: '12px'}}>
                        <div onClick={this.onCreateNewScriptClick.bind(this)} style={{padding: '8px', borderRadius: '2px', width: '150px', borderColor: '#1565c0', display: 'flex', alignItems: 'center', background: '#1565c0', color: 'white',  cursor: 'pointer', flexDirection: 'row', alignSelf: 'center'}}>
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
            flatTree: {},
            childPosition: 0,
            childrenLength: 0,
            highlightedNode: undefined,
            premiseNode: "",
            premiseRelativeValue: 1,
            centerLock: true,
            scriptDoesNotExist: false,
            insufficientPermission: false,
            checkingForPermission: false,
            collaborators: {},
            hotkeysEnabled: true
        };

        this.handleScroll = this.handleScroll.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.scriptHeaders) {
            let scriptList = Object.keys(nextProps.scriptHeaders);
            if (!scriptList.includes(nextProps.match.params.scriptId)) {
                this.setState({scriptDoesNotExist: true});
            }
        }
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

        store.subscribe(() => {
                this.setState({hotkeysEnabled: store.getState().hotkeysEnabled})
            }
        )


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



                if(calculatedLeftScroll>50) {
                    window.scrollTo(calculatedLeftScroll, 0);
                }
            }
        }
    }

    checkKey(e) {

        e = e || window.event;
        if(this.state.centerLock) {
            this.setState({centerLock: false});
        }

        if(this.state.hotkeysEnabled) {


            if (e.keyCode == '38') {
                e.preventDefault();
                // up arrow

                Element.prototype.documentOffsetTop = function () {
                    return this.offsetTop + ( this.offsetParent ? this.offsetParent.documentOffsetTop() : 0 );
                };

                if (!this.state.highlightedNode) {

                    let el = document.getElementById(this.state.premiseNode);
                    let viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                    let viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);


                    let bodyRect = document.body.getBoundingClientRect(),
                        elemRect = el.getBoundingClientRect(),
                        offsetTop = elemRect.top + window.scrollY - Math.max(viewportHeight / 2),
                        offsetLeft = elemRect.left + window.scrollX - Math.max(viewportWidth / 2) + 150;


                    window.scrollTo(offsetLeft, offsetTop);


                    store.dispatch({type: 'SET_HIGHLIGHTED_NODE', highlightedNode: this.state.premiseNode});
                    this.setState({highlightedNode: this.state.premiseNode});
                    return;
                }

                if (this.state.highlightedNode === this.state.premiseNode) {
                    return;
                }

                if (!document.getElementById(this.state.flatTree[this.state.highlightedNode].parentUid)) {
                    return;
                }

                let el = document.getElementById(this.state.flatTree[this.state.highlightedNode].parentUid);
                let viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                let viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);


                var bodyRect = document.body.getBoundingClientRect(),
                    elemRect = el.getBoundingClientRect(),
                    offsetTop = elemRect.top + window.scrollY - Math.max(viewportHeight / 2),
                    offsetLeft = elemRect.left + window.scrollX - Math.max(viewportWidth / 2) + 150;


                window.scrollTo(offsetLeft, offsetTop);
                // window.scrollTo({top: offsetTop, left: offsetLeft, behavior: 'smooth'});


                let nextNodeId = this.state.flatTree[this.state.highlightedNode].parentUid;
                let parentId = this.state.flatTree[nextNodeId].parentUid;

                let childPosition = 0;
                let childrenLength = 0;
                if (this.state.flatTree[parentId]) {
                    let parentChildren = Object.keys(this.state.flatTree[parentId].children);
                    childPosition = parentChildren.indexOf(nextNodeId);
                    childrenLength = Object.keys(this.state.flatTree[parentId].children).length;
                }

                store.dispatch({
                    type: 'SET_HIGHLIGHTED_NODE',
                    highlightedNode: this.state.flatTree[this.state.highlightedNode].parentUid
                });
                this.setState({
                    highlightedNode: this.state.flatTree[this.state.highlightedNode].parentUid,
                    childPosition: childPosition,
                    childrenLength: childrenLength
                });

            }
            else if (e.keyCode == '40') {
                e.preventDefault();
                // down arrow
                if (!this.state.highlightedNode) {

                    let el = document.getElementById(this.state.premiseNode);
                    let viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                    let viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);


                    let bodyRect = document.body.getBoundingClientRect(),
                        elemRect = el.getBoundingClientRect(),
                        offsetTop = elemRect.top + window.scrollY - Math.max(viewportHeight / 2),
                        offsetLeft = elemRect.left + window.scrollX - Math.max(viewportWidth / 2) + 150;


                    window.scrollTo(offsetLeft, offsetTop);

                    store.dispatch({type: 'SET_HIGHLIGHTED_NODE', highlightedNode: this.state.premiseNode});
                    this.setState({highlightedNode: this.state.premiseNode});
                    return;
                }

                if (!this.state.flatTree[this.state.highlightedNode].children) {
                    return;
                }

                if (!document.getElementById(Object.keys(this.state.flatTree[this.state.highlightedNode].children)[0])) {
                    return;
                }


                let el = document.getElementById(Object.keys(this.state.flatTree[this.state.highlightedNode].children)[0]);
                let viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                let viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);


                let bodyRect = document.body.getBoundingClientRect(),
                    elemRect = el.getBoundingClientRect(),
                    offsetTop = elemRect.top + window.scrollY - Math.max(viewportHeight / 2),
                    offsetLeft = elemRect.left + window.scrollX - Math.max(viewportWidth / 2) + 150;


                window.scrollTo(offsetLeft, offsetTop);

                //
                // console.log(Object.keys(this.state.flatTree[this.state.highlightedNode].children)[0])
                // document.getElementById(Object.keys(this.state.flatTree[this.state.highlightedNode].children)[0] ).scrollIntoView(false);

                store.dispatch({
                    type: 'SET_HIGHLIGHTED_NODE',
                    highlightedNode: Object.keys(this.state.flatTree[this.state.highlightedNode].children)[0]
                });
                this.setState({
                    highlightedNode: Object.keys(this.state.flatTree[this.state.highlightedNode].children)[0],
                    childPosition: 0,
                    childrenLength: Object.keys(this.state.flatTree[this.state.highlightedNode].children).length
                });

            }
            else if (e.keyCode == '37') {
                e.preventDefault();
                // left arrow

                if (!this.state.highlightedNode) {

                    let el = document.getElementById(this.state.premiseNode);
                    let viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                    let viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);


                    let bodyRect = document.body.getBoundingClientRect(),
                        elemRect = el.getBoundingClientRect(),
                        offsetTop = elemRect.top + window.scrollY - Math.max(viewportHeight / 2),
                        offsetLeft = elemRect.left + window.scrollX - Math.max(viewportWidth / 2) + 150;


                    window.scrollTo(offsetLeft, offsetTop);

                    store.dispatch({type: 'SET_HIGHLIGHTED_NODE', highlightedNode: this.state.premiseNode});
                    this.setState({highlightedNode: this.state.premiseNode});
                    return;
                }
                if (this.state.childrenLength === 0) {
                    return;
                }

                if (this.state.childPosition === 0) {
                    return;
                }

                if (!this.state.flatTree[this.state.flatTree[this.state.highlightedNode].parentUid]) {
                    console.log('hit');
                    return;
                }

                if (!this.state.flatTree[this.state.flatTree[this.state.highlightedNode].parentUid].children) {
                    console.log('hit');
                    return;
                }


                if (!document.getElementById(Object.keys(this.state.flatTree[this.state.flatTree[this.state.highlightedNode].parentUid].children)[this.state.childPosition - 1])) {
                    return;
                }


                let el = document.getElementById(Object.keys(this.state.flatTree[this.state.flatTree[this.state.highlightedNode].parentUid].children)[this.state.childPosition - 1]);
                let viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                let viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);


                let bodyRect = document.body.getBoundingClientRect(),
                    elemRect = el.getBoundingClientRect(),
                    offsetTop = elemRect.top + window.scrollY - Math.max(viewportHeight / 2),
                    offsetLeft = elemRect.left + window.scrollX - Math.max(viewportWidth / 2) + 150;


                window.scrollTo(offsetLeft, offsetTop);

                // document.getElementById(Object.keys(this.state.flatTree[this.state.flatTree[this.state.highlightedNode].parentUid].children)[this.state.childPosition - 1] ).scrollIntoView(false);

                store.dispatch({
                    type: 'SET_HIGHLIGHTED_NODE',
                    highlightedNode: Object.keys(this.state.flatTree[this.state.flatTree[this.state.highlightedNode].parentUid].children)[this.state.childPosition - 1]
                });
                this.setState({
                    highlightedNode: Object.keys(this.state.flatTree[this.state.flatTree[this.state.highlightedNode].parentUid].children)[this.state.childPosition - 1],
                    childPosition: this.state.childPosition - 1,
                    childrenLength: Object.keys(this.state.flatTree[this.state.flatTree[this.state.highlightedNode].parentUid].children).length
                });

            }
            else if (e.keyCode == '39') {
                e.preventDefault();
                // right arrow

                if (!this.state.highlightedNode) {

                    let el = document.getElementById(this.state.premiseNode);
                    let viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                    let viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);


                    let bodyRect = document.body.getBoundingClientRect(),
                        elemRect = el.getBoundingClientRect(),
                        offsetTop = elemRect.top + window.scrollY - Math.max(viewportHeight / 2),
                        offsetLeft = elemRect.left + window.scrollX - Math.max(viewportWidth / 2) + 150;


                    window.scrollTo(offsetLeft, offsetTop);


                    store.dispatch({type: 'SET_HIGHLIGHTED_NODE', highlightedNode: this.state.premiseNode});
                    this.setState({highlightedNode: this.state.premiseNode});
                    return;
                }


                if (this.state.childrenLength === 0) {
                    return;
                }

                if (this.state.childPosition === this.state.childrenLength - 1) {
                    return;
                }


                if (!this.state.flatTree[this.state.flatTree[this.state.highlightedNode].parentUid]) {
                    return;
                }

                if (!this.state.flatTree[this.state.flatTree[this.state.highlightedNode].parentUid].children) {
                    return;
                }

                if (!document.getElementById(Object.keys(this.state.flatTree[this.state.flatTree[this.state.highlightedNode].parentUid].children)[this.state.childPosition + 1])) {
                    return;
                }

                let el = document.getElementById(Object.keys(this.state.flatTree[this.state.flatTree[this.state.highlightedNode].parentUid].children)[this.state.childPosition + 1]);
                let viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                let viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);


                let bodyRect = document.body.getBoundingClientRect(),
                    elemRect = el.getBoundingClientRect(),
                    offsetTop = elemRect.top + window.scrollY - Math.max(viewportHeight / 2),
                    offsetLeft = elemRect.left + window.scrollX - Math.max(viewportWidth / 2) + 150;


                window.scrollTo(offsetLeft, offsetTop);


                // document.getElementById(Object.keys(this.state.flatTree[this.state.flatTree[this.state.highlightedNode].parentUid].children)[this.state.childPosition + 1] ).scrollIntoView(false);

                store.dispatch({
                    type: 'SET_HIGHLIGHTED_NODE',
                    highlightedNode: Object.keys(this.state.flatTree[this.state.flatTree[this.state.highlightedNode].parentUid].children)[this.state.childPosition + 1]
                });
                this.setState({
                    highlightedNode: Object.keys(this.state.flatTree[this.state.flatTree[this.state.highlightedNode].parentUid].children)[this.state.childPosition + 1],
                    childPosition: this.state.childPosition + 1,
                    childrenLength: Object.keys(this.state.flatTree[this.state.flatTree[this.state.highlightedNode].parentUid].children).length
                });
            }


            else if (e.keyCode == '13') {
                //enter

                if (this.state.highlightedNode) {
                    e.preventDefault();
                    this.setState({hotkeysEnabled: false});
                    document.getElementById(this.state.highlightedNode).focus();
                }

            }


            else if (e.keyCode == '27') {
                //esc

                if (this.state.highlightedNode) {
                    this.setState({hotkeysEnabled: true});
                    document.getElementById(this.state.highlightedNode).blur();
                }

            }

        }
        else {
            if (e.keyCode == '27') {
                //esc

                if (this.state.highlightedNode) {
                    this.setState({hotkeysEnabled: true});
                    document.getElementById(this.state.highlightedNode).blur();
                }

            }
        }

    }

    setHighlightedNode(nodeUid) {

        let nextNodeId = nodeUid;
        let parentId = this.state.flatTree[nextNodeId].parentUid;

        let childPosition = 0;
        let childrenLength = 0;
        if(this.state.flatTree[parentId]) {
            let parentChildren = Object.keys(this.state.flatTree[parentId].children);
            childPosition = parentChildren.indexOf(nextNodeId);
            childrenLength = Object.keys(this.state.flatTree[parentId].children).length;
        }



        store.dispatch({type: 'SET_HIGHLIGHTED_NODE', highlightedNode: nodeUid});
        this.setState({highlightedNode: nodeUid, childPosition: childPosition, childrenLength: childrenLength});
    }

    setHotkeysEnabledFlag(flag) {
        this.setState({hotkeysEnabled: flag});
    }



    componentWillMount() {

        document.body.style.backgroundColor = "#e9ebee";
        document.onkeydown = this.checkKey.bind(this);

        db.collection('scripts').doc(this.props.match.params.scriptId).collection('collaborators').onSnapshot(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                let collaborators = this.state.collaborators;
                collaborators[doc.id] = doc.data();
                this.setState({collaborators: collaborators})
            }.bind(this));

        }.bind(this), function(error){
            console.log('error in collab fetch', error)
        });

        db.collection('scripts').doc(this.props.match.params.scriptId).onSnapshot(function (doc) {
            if(doc.exists) {
                this.setState({scope: doc.data().scope})
            }
        }.bind(this), function(error){
            console.log('nerror in scope fetch', error)
        });

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
                            this.setState({tree: tree, flatTree: tempTree})

                        } else {
                            console.log("No such script");
                            this.setState({scriptDoesNotExist: true});
                        }
                    }.bind(this)).catch(function (error) {
                        this.setState({scriptDoesNotExist: true});
                        console.log("Error getting script:", error);
                    }.bind(this));


                }.bind(this), function (error) {
                    this.setState({checkingForPermission: true, scriptDoesNotExist: false});
                    console.log('script-fetch-onSnapshot error:', error);
                    console.log('attempting to fetch again...');
                    if(retryCount<10) {
                        setTimeout(function () {
                            if (this.props.history.location.pathname !== '/') {
                                fetchTree.call(this, retryCount);
                            }
                        }.bind(this), 200);
                    }
                    else {
                        this.setState({checkingForPermission: false, insufficientPermission: true, scriptDoesNotExist: false});
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
                {
                    (this.props.user===null && this.state.scope === 'public' && Object.keys(this.state.tree).length>0) ||
                    (this.props.user && this.state.scope === 'public' && Object.keys(this.state.tree).length>0 && !this.state.collaborators[this.props.user.uid]) ?

                        <div className={contentClass}>
                            <div className="EditorContainer">
                                <div className="tree" id="tree">
                                    <Fragment user={this.props.user}
                                              data={this.state.tree}
                                              children={this.state.tree[Object.keys(this.state.tree)[0]]? Object.keys(this.state.tree[Object.keys(this.state.tree)[0]]['children']): []}
                                              siblings={Object.keys(this.state.tree)}
                                              parentNodeId={Object.keys(this.state.tree)[0]}
                                              scriptId={this.props.match.params.scriptId}
                                              premiseRelativeValue={this.state.premiseRelativeValue}
                                              setHighlightedNode={this.setHighlightedNode.bind(this)}
                                              setHotkeysEnabledFlag={this.setHotkeysEnabledFlag.bind(this)}
                                              canEdit={false}/>

                                </div>
                            </div>
                        </div>


                        :

                        <div>
                            { (!this.state.checkingForPermission && !this.state.scriptDoesNotExist &&
                            !this.state.insufficientPermission && Object.keys(this.state.collaborators).length>0
                            && this.props.user) &&
                            <div className={contentClass}>

                                { this.state.collaborators[this.props.user.uid] &&
                                <div className="EditorContainer">
                                    <div className="tree" id="tree">
                                        <Fragment user={this.props.user}
                                                  data={this.state.tree}
                                                  parentNodeId={Object.keys(this.state.tree)[0]}
                                                  scriptId={this.props.match.params.scriptId}
                                                  premiseRelativeValue={this.state.premiseRelativeValue}
                                                  setHighlightedNode={this.setHighlightedNode.bind(this)}
                                                  setHotkeysEnabledFlag={this.setHotkeysEnabledFlag.bind(this)}
                                                  canEdit={this.state.collaborators[this.props.user.uid]['isOwner'] || (this.state.collaborators[this.props.user.uid]['permission'] === 'write')}/>

                                    </div>
                                </div>
                                }

                            </div>
                            }
                        </div>


                };

                { this.state.scriptDoesNotExist &&
                <div style={{marginTop: '150px', display: 'flex', justifyContent: 'center'}}>
                    <div style={{width: '300px', alignItems: 'center', padding: '20px', display: 'flex', flexDirection: 'column', background: 'white', boxShadow: '1px 1px 4px rgba(0,0,0,.3)'}}>
                        <i className="material-icons" style={{textDecoration: 'none', color: '#f57f17', fontSize: '35px'}}>warning</i>
                        <div style={{textAlign: 'center'}}>script does not exist</div>
                    </div>
                </div>

                }

                { this.state.checkingForPermission &&
                <div style={{marginTop: '150px', display: 'flex', justifyContent: 'center'}}>
                    <svg className="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                        <circle className="path" fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"/>
                    </svg>
                </div>
                }

                { this.state.insufficientPermission &&
                <div style={{marginTop: '150px', display: 'flex', justifyContent: 'center'}}>
                    <div style={{width: '300px',  alignItems: 'center', padding: '20px', display: 'flex', flexDirection: 'column', background: 'white', boxShadow: '1px 1px 4px rgba(0,0,0,.3)'}}>
                        <i className="material-icons" style={{textDecoration: 'none', color: '#f57f17', fontSize: '35px'}}>warning</i>
                        <div style={{textAlign: 'center'}}>script does not exist or you have insufficient permission to view this script</div>
                    </div>
                </div>
                }


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
            scriptIds: [],
            signupInProgress: false
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

        if(event.target.value.length>16) {
            event.target.setCustomValidity("username shouldn't be more than 16 characters")
        } else {
            event.target.setCustomValidity("")
        }

        clearTimeout(this.timer);
        this.timer = setTimeout(this.checkUsername.bind(this, event.target.value), 1000);

    }

    checkUsername(username) {
        console.log('checking for username...');


        let helloUserUrl = 'https://us-central1-argument-app.cloudfunctions.net/app/checkUsername';
        // let helloUserUrl = 'http://localhost:5000/argument-app/us-central1/app/checkUsername';

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
            this.setState({signupInProgress: true, signupError: ''});
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

                firebase.auth().currentUser.sendEmailVerification().then(function() {
                    console.log('verification email sent');
                    // Email sent.
                }).catch(function(error) {
                    // An error happened.
                });


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
                this.setState({signupError: errorMessage, signupInProgress: false})
            }.bind(this));

        console.log('signup:', result)

    }




    render() {
        return <div style={{width: '350px', marginBottom: '20px'}}>

            <div style={{background: 'white', color: '#1565c0', textAlign: 'center', padding: '10px', fontSize: '19px', marginTop: '15px'}}>Signup</div>
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
                {this.state.signupInProgress && <div style={{display: 'flex', justifyContent: 'center', paddingLeft: '50px', paddingRight: '50px', marginTop: '5px'}}>
                    <svg className="spinner" width="40px" height="40px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                        <circle className="path" fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"/>
                    </svg>
                </div>}
            </form>
            <div style={{fontSize: '13px', paddingLeft: '50px', paddingRight: '50px', color: 'red', paddingBottom: '10px'}}>
                {this.state.signupError}
            </div>

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
            scriptIds: [],
            loginInProgress: false
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
            console.log('auth-error:', error, errorCode);
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

        let helloUserUrl = 'https://us-central1-argument-app.cloudfunctions.net/app/fetchUserFromUsername';
        // let helloUserUrl = 'http://localhost:5000/argument-app/us-central1/app/fetchUserFromUsername';

        let params = "username=" + username;

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
                this.setState({loginInProgress: false, loginError: "username doesn't exist"})
            }

            else if(JSON.parse(req.responseText).code===2) {
                this.setState({loginInProgress: false, loginError: "an unexpected error has occured"})
            }


            return true;
        }.bind(this);
        req.onerror = function(err) {
            console.log(err);
            this.setState({usernameHasChanged: false, usernameVerified: false, loginInProgress: false, loginError: 'an unexpected error has occured'});
            return -100;
        }.bind(this);
        req.open('GET', helloUserUrl + "?" + params, true);
        // req.setRequestHeader('Authorization', 'Bearer ' + token);
        req.send();
    }

    handleLoginSubmit(event) {
        this.setState({loginError: '', loginInProgress: true});

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
            <div style={{background: 'white', color: '#1565c0', textAlign: 'center', padding: '10px', fontSize: '19px', marginTop: '15px'}}>Login</div>
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

                {this.state.loginInProgress && <div style={{display: 'flex', justifyContent: 'center', paddingLeft: '50px', paddingRight: '50px', marginTop: '5px'}}>
                    <svg className="spinner" width="40px" height="40px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                        <circle className="path" fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"/>
                    </svg>
                </div>}
            </form>
            <div style={{color: 'red', fontSize: '13px', paddingLeft: '50px', paddingRight: '50px', paddingBottom: '25px'}}>{this.state.loginError}</div>

            <div style={{display: 'flex', marginBottom: '10px', justifyContent: 'center'}}>
            <div style={{color: '#0d47a1', cursor: 'pointer', textDecoration: 'underline', fontSize: '13px'}} onClick={this.props.openForgotPasswordModal}>forgot password?</div>
            </div>

        </div>
    }
}

class Landing extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        window.scrollTo(0,0);
        document.body.style.backgroundColor = "white";
    }

    componentDidMount() {
        document.title = 'Scrippt';
    }

    onAnonymousLoginSubmit() {
        firebase.auth().signInAnonymously()
            .then(function(user) {
                console.log('login:', user.uid.substring(0,20));
                let username = user.uid.substring(0,15);
                db.collection("users").doc(user.uid).set({
                    uid: user.uid,
                    email: user.email,
                    emailVerified: user.emailVerified,
                    photoURL: user.photoURL,
                    isAnonymous: user.isAnonymous,
                    displayName: user.displayName,
                    phoneNumber: user.phoneNumber,
                    username: username
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
                console.log('anonymous-error:', error);
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
        });

    }

    render() {
        return (
            <div style={{display: 'flex', flex: 1, height: '100vh', flexDirection: 'column'}}>
                <div style={{ flex: 1, marginTop: '100px'}}>

                    <div style={{height: '400px', display: 'flex'}}>
                    <div style={{flex: 2, display: 'flex', flexDirection: 'column', paddingTop: '75px', paddingLeft: '100px'}}>
                        <img style={{width: 100, height: 100}} src={landingSectionOne}></img>
                        <div style={{paddingTop: '20px', fontSize: '20px', width: '400px'}}>
                            A better way to structure and process your thoughts.
                        </div>
                    </div>
                        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginRight: '50px', boxShadow: '1px 1px 4px rgba(0,0,0,.3)'}}>
                            <Signup/>
                            <div style={{paddingLeft: '50px', paddingRight: '50px'}}>
                                <input onClick={this.onAnonymousLoginSubmit.bind(this)} style={{width: '100%', fontSize: '14px', height: '30px', background: 'black', borderColor: 'transparent', color: '#fff',cursor: 'pointer' }} type="submit" value="Login Anonymously"/>
                            </div>
                        </div>
                    </div>


                    <div style={{height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <img style={{width: 100, height: 100}} src={landingSectionTwo}></img>
                        <div style={{paddingTop: '20px', fontSize: '20px', width: '400px'}}>
                            Focused on streamlining critical thinking
                        </div>
                        <div style={{width: '600px', textAlign: 'center', marginTop: '20px'}}>
                            Offers various formats that are much more efficient
                            at structuring and processing information
                            than traditional document formats
                        </div>
                    </div>

                    <div style={{height: '600px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>

                        <img style={{width: 100, height: 100}} src={landingSectionThree}></img>
                        <div style={{display: 'flex', justifyContent: 'center', paddingTop: '20px', fontSize: '20px', width: '400px'}}>
                            Create
                        </div>
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <div style={{margin: '50px'}}>
                                <img style={{width: 100, height: 100}} src={landingSectionArgumentMap}></img>
                                <div>
                                    argument maps
                                </div>

                            </div>
                            <div style={{margin: '50px'}}>
                                <img style={{width: 100, height: 100}} src={landingSectionDecisionTree}></img>
                                <div>
                                    decision trees*
                                </div>

                            </div>
                            <div style={{margin: '50px'}}>
                                <img style={{width: 100, height: 100}} src={landingSectionNestedList}></img>
                                <div>
                                    nested lists*
                                </div>

                            </div>
                            <div style={{margin: '50px', alignSelf: 'center'}}>
                                <div>
                                    and more*
                                </div>

                            </div>
                        </div>

                        <div>*coming soon</div>
                    </div>

                    <div style={{height: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>

                        <img style={{width: 100, height: 100}} src={landingSectionFive}></img>
                        <div style={{paddingTop: '20px', fontSize: '20px', width: '400px', textAlign: 'center'}}>
                            Collaborate with others
                        </div>
                        <div style={{width: '600px', textAlign: 'center', marginTop: '20px'}}>
                            Share your scripts with the public or other users and invite them to work on your scripts in a real-time editor.
                        </div>



                    </div>
                </div>

                <div style={{ flex: 0, alignSelf: 'center', marginBottom: '20px'}}>
                    <div style={{display: 'flex',  flexDirection: 'row'}}>
                        <div style={{margin: '10px', fontSize: '14px'}}><Link to='/privacy'>Privacy</Link></div>
                        <div style={{margin: '10px', fontSize: '14px'}}><Link to='/terms'>Terms</Link></div>
                        <div style={{margin: '10px', fontSize: '14px'}}>contact: <a href="mailto:scripptapp@gmail.com">scripptapp@gmail.com</a> </div>
                    </div>
                </div>
            </div>
        )
    }
}

class NoMatch extends Component {

    render() {
        return (
            <div style={{marginTop: '150px', display: 'flex', justifyContent: 'center'}}>
            <div style={{width: '300px',  alignItems: 'center', padding: '20px', display: 'flex', flexDirection: 'column', background: 'white', boxShadow: '1px 1px 4px rgba(0,0,0,.3)'}}>
                <i className="material-icons" style={{textDecoration: 'none', color: '#f57f17', fontSize: '35px'}}>warning</i>
                <div>page not found</div>
            </div>
        </div>
        )
    }
}

class Privacy extends Component {


    componentWillMount() {
        window.scrollTo(0,0);
        document.body.style.backgroundColor = "#e9ebee";
    }

    render() {
        return (
            <div style={{margin: '30px'}}>
                <div >
                    <br/><br/>
                    <h2>Privacy Policy</h2>


                    Last updated: January 2, 2018

                    Scrippt ("us", "we", or "our") operates the scripptapp.com website (the "Service").
                    This page informs you of our policies regarding the collection, use and disclosure of Personal Information when you use our Service.
                    We will not use or share your information with anyone except as described in this Privacy Policy.
                    We use your personal Information for providing and improving the Service. By using the Service, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, accessible at scripptapp.com.

                    <br/><br/>

                    <h3>Information Collection And Use</h3>

                    While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you.

                    <br/><br/>

                    <h3>Log Data</h3>

                    We collect information that your browser sends whenever you visit our Service ("Log Data"). This Log Data may include information such as your computer's Internet Protocol ("IP") address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages and other statistics.
                    In addition, we may use third party services such as Google Analytics that collect, monitor and analyze this type of information in order to increase our Service's functionality. These third party service providers have their own privacy policies addressing how they use such information.

                    <br/><br/>

                    <h3>Cookies</h3>

                    Cookies are files with small amount of data, which may include an anonymous unique identifier. Cookies are sent to your browser from a web site and stored on your computer's hard drive.
                    We use "cookies" to collect information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.

                    <br/><br/>

                    <h3>DoubleClick Cookie</h3>

                    Google, as a third party vendor, uses cookies to serve ads on our Service. Google's use of the DoubleClick cookie enables it and its partners to serve ads to our users based on their visit to our Service or other web sites on the Internet.
                    You may opt out of the use of the DoubleClick Cookie for interest-based advertising by visiting the Google Ads Settings web page.

                    <br/><br/>

                    <h3>Service Providers</h3>

                    We may employ third party companies and individuals to facilitate our Service, to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used.
                    These third parties have access to your Personal Information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.

                    <br/><br/>

                    <h3>Security</h3>

                    The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.

                    <br/><br/>

                    <h3>International Transfer</h3>

                    Your information, including Personal Information, may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from your jurisdiction.
                    If you are located outside Sweden and choose to provide information to us, please note that we transfer the information, including Personal Information, to Sweden and process it there.
                    Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.

                    <br/><br/>

                    <h3>Links To Other Sites</h3>

                    Our Service may contain links to other sites that are not operated by us. If you click on a third party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit.
                    We have no control over, and assume no responsibility for the content, privacy policies or practices of any third party sites or services.

                    <br/><br/>

                    <h3>Children's Privacy</h3>

                    Our Service does not address anyone under the age of 13 ("Children").
                    We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your Children has provided us with Personal Information, please contact us. If we become aware that we have collected Personal Information from a children under age 13 without verification of parental consent, we take steps to remove that information from our servers.

                    <br/><br/>

                    <h3>Changes To This Privacy Policy</h3>

                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                    You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.

                    <br/><br/>

                    <h3>Contact Us</h3>

                    If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:scripptapp@gmail.com"> scripptapp@gmail.com </a>

                    <br/><br/>

                    <h3><Link to='/'>Back To Home </Link></h3>

                    <br/><br/>

                </div>



            </div>
        )
    }
}


class Terms extends Component {

    componentWillMount() {
        window.scrollTo(0,0);
        document.body.style.backgroundColor = "#e9ebee";
    }

    render() {
        return (
            <div style={{margin: '30px'}}>
                <div>
                    <br/><br/>
                    <h2>Terms and Conditions</h2>


                    Last updated: January 2, 2018

                    Please read these Terms and Conditions ("Terms", "Terms and Conditions") carefully before using the scripptapp.com website (the "Service") operated by Scrippt ("us", "we", or "our").
                    Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service.

                    By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.

                    <br/><br/>
                    <h3>Intellectual Property</h3>

                    The Service and its original content, features and functionality are and will remain the exclusive property of Scrippt and its licensors. The Service is protected by copyright, trademark, and other laws of both India and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Scrippt.

                    <br/><br/>
                    <h3>Links To Other Web Sites</h3>

                    Our Service may contain links to third-party web sites or services that are not owned or controlled by Scrippt.
                    Scrippt has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that Scrippt shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services.
                    We strongly advise you to read the terms and conditions and privacy policies of any third-party web sites or services that you visit.

                    <br/><br/>
                    <h3>Termination</h3>

                    We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    Upon termination, your right to use the Service will immediately cease.

                    <br/><br/>
                    <h3>Limitation Of Liability</h3>

                    In no event shall Scrippt, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.

                    <br/><br/>
                    <h3>Disclaimer</h3>

                    Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
                    Scrippt its subsidiaries, affiliates, and its licensors do not warrant that a) the Service will function uninterrupted, secure or available at any particular time or location; b) any errors or defects will be corrected; c) the Service is free of viruses or other harmful components; or d) the results of using the Service will meet your requirements.

                    <br/><br/>
                    <h3>Governing Law</h3>

                    These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                    Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our Service, and supersede and replace any prior agreements we might have between us regarding the Service.

                    <br/><br/>
                    <h3>Changes</h3>

                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                    By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.

                    <br/><br/>
                    <h3>Contact Us</h3>

                    If you have any questions about these Terms, please contact us at: <a href="mailto:scipptapp@gmail.com"> scripptapp@gmail.com </a>

                    <br/><br/>

                    <h3><Link to='/'>Back To Home </Link></h3>

                    <br/><br/>


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
                        let scriptIds = [];
                        querySnapshot.forEach(function(doc) {
                            scriptIds.push(doc.data().uid)
                        });

                        store.dispatch({type: 'SCRIPT_FETCH_COMPLETE', scriptFetchComplete: true, numScripts: scriptIds.length});

                        //deleting script headers
                        if(scriptIds.length < this.state.scriptIds.length) {
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

                        scriptIds.map(async(id) => {
                            let doc = await db.collection('scripts').doc(id).get();
                            if(doc.exists) {
                                let scriptHeaderObj = Object.assign({}, this.state.scriptHeaders, {[id]: doc.data()});
                                scriptHeaderObj[id] = doc.data();
                                store.dispatch({type: 'SCRIPT_NUM_UPDATE', numScripts: Object.keys(scriptHeaderObj).length});
                                this.setState({scriptHeaders: scriptHeaderObj});

                            } else {
                                store.dispatch({type: 'SCRIPT_NUM_UPDATE', numScripts: store.getState().numScripts - 1 });
                            }

                        });


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
