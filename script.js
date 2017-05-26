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

firebase.database().ref('test/').update(tree);


// obj = {'345': 'a', '234': 'b'}
//
// Object.keys(obj).map(function(key, index) {
//     console.log(key, index, obj[key])
// });
//




// firebase.database().ref().child('test').orderByChild('uid').startAt(123).endAt(123).on("child_added", function(snapshot) {
//     console.log(snapshot.val());
// });

// firebase.database().ref().child('test').once('value', function(snap) { console.log(snap.val()) });

