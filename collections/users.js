const { db } = require("../firebase");

class Users {
    static getUser(userId) {
        const collection = db.collection('users')
        return collection.doc(userId);
    }

    static getAll() {
        return db.collection('users');
    }

    static updateMatch(userId, matchedId) {
        const user = this.getUser(userId);
        const matches = user.matches || [];
        if (matches.indexOf(matchedId) === -1) {
            matches.push(matchedId);
        }
        return user.update({ matches });
    }
}

module.exports = { Users };