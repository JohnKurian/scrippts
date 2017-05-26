/**
 * Created by john on 5/23/17.
 */

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




tree = {'sada': {data: "parent", children: {'ewrtrtert': {data: "child1", children: {'5fsdf': {data: "grandchild2"}}}, 'bxcbcvxnvcn': {data: "child2", children: {'hjhgjhgj': {data: "grandchild2"}}}}}};


// Initial premise node creation ..................

// let newRef = firebase.database().ref('test_1/').push();
//
// let pathObj = {};
// pathObj[newRef.key] = Date.now();
//
// let obj = {
//     uid: newRef.key,
//     text: 'this is the premise',
//     path: pathObj
// };
//
// newRef.set(obj);

///////////////////////////////////////////


// obj = {'345': 'a', '234': 'b'}
//
// Object.keys(obj).map(function(key, index) {
//     console.log(key, index, obj[key])
// });
//




// firebase.database().ref().child('test').orderByChild('uid').startAt(123).endAt(123).on("child_added", function(snapshot) {
//     console.log(snapshot.val());
// });


//
// firebase.database().ref().child('test_1').once('value', function(snap) {
//     console.log(snap.val())
//
//     console.log(snap.key)
//
//     let path = snap.val()[Object.keys(snap.val())[0]].path
//     console.log(path)
//
//     var pathStr = '';
//     Object.keys(path).map(function(key, index) {
//         console.log('im in here', key)
//         pathStr = pathStr + key;
//         pathStr = pathStr +  (index==Object.keys(path).length)?"":"children/";
//     })
//
//     console.log("the string", pathStr)
// });


var path = {
    '-Kl4gtdeSxhHgK-b5TaK': 2432453423423,
    '-Kl4gtdeSxhHgK-b5TaK2': 2432453423423
}

pathStr = '';

// console.log(Object.keys(path).join('/children/'))

// Object.keys(path).map(function(key, index) {
//     console.log('im in here', key)
//     pathStr = pathStr + key;
//     pathStr = pathStr +  (index==Object.keys(path).length)?'':"children/";
//
//     console.log('pathStr:', pathStr)
// })
//
// console.log("the string", pathStr)


