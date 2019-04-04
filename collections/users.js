const {db} = require("../firebase");

class Users {
    static getUser(userId) {
        const collection = db.collection('users')
        return collection.doc(userId);
    }
}

module.exports = { Users };