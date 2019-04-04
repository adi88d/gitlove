const admin = require('firebase-admin');

const serviceAccount = require('./firebase-auth.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://gitlove-a27e8.firebaseio.com"
});

module.exports = {
    db: admin.database(),
    auth: admin.auth()
};