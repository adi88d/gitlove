const {db} = require("../firebase");

class Users {
    static getUser(userId) {
        const collection = db.collection('users')
        return collection.doc(userId);
    }

    static getAll(){
        return db.collection('users');
    }
}

module.exports = { Users };