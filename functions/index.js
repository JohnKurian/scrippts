'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const express = require('express');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({origin: true});
const app = express();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});




// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const validateFirebaseIdToken = (req, res, next) => {
    console.log('Check if request is authorized with Firebase ID token');

    if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
        !req.cookies.__session) {
        console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
            'Make sure you authorize your request by providing the following HTTP header:',
            'Authorization: Bearer <Firebase ID Token>',
            'or by passing a "__session" cookie.');
        res.status(403).send('Unauthorized');
        return;
    }

    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        console.log('Found "Authorization" header');
        // Read the ID Token from the Authorization header.
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
        console.log('Found "__session" cookie');
        // Read the ID Token from cookie.
        idToken = req.cookies.__session;
    }
    admin.auth().verifyIdToken(idToken).then(decodedIdToken => {
        console.log('ID Token correctly decoded', decodedIdToken);
        req.user = decodedIdToken;
        next();
    }).catch(error => {
        console.error('Error while verifying Firebase ID token:', error);
        res.status(403).send('Unauthorized');
    });
};

app.use(cors);
app.use(cookieParser);
app.use(validateFirebaseIdToken);
app.get('/share', (req, res) => {

    //fetch user uid

    admin.firestore().collection('users').where('email', '==', req.query['id'])
        .get()
        .then(function(querySnapshot) {
            if(querySnapshot._docs().length===0) {
                res.send({code: 0, msg: 'error: user email not found'})
                return;
            }
            querySnapshot.forEach(function(doc) {
                console.log(doc.id, " => ", doc.data());

                let uid = doc.data()['uid'];
                let email = doc.data()['email'];

                //add to scripts/collaborators
                let collabObj = {};
                collabObj['permission'] = req.query['accessLevel'];
                collabObj['uid'] = uid;
                collabObj['email'] = email;
                collabObj['isOwner'] = false;

                admin.firestore().collection('scripts').doc(req.query['scriptId']).collection('collaborators').doc(uid).set(collabObj)
                    .then(writeResult => {
                        // Send back a message that we've succesfully written the message

                        //add to users/scripts

                        let userScriptObj = {
                            'collaborator': true,
                            'creator': false,
                            'forked': false,
                            'uid': req.query['scriptId']
                        };

                        admin.firestore().collection('users').doc(uid).collection('scripts').doc(req.query['scriptId']).set(userScriptObj)
                            .then(writeResult => {

                                console.log('write:', writeResult.id);

                                console.log('query:', req.query);
                                res.send({code: 1, msg: 'collaborator successfully added'});

                            });

                    });

            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
            res.send({code: 2, msg: 'error: cannot find document'});
        });




});


app.get('/removeCollaborator', (req, res) => {
    admin.firestore().collection("users").doc(req.query.userId).collection('scripts').doc(req.query.scriptId).delete().then(function() {
        console.log("Document successfully deleted!");
        res.send({code: 1, msg: 'successfully removed collaborator'})
    }).catch(function(error) {
        console.error("Error removing document: ", error);
        res.send({code: 2, msg: 'error removing document'})
    });
});

// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.app = functions.https.onRequest(app);
