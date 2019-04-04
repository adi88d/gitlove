const {db} = require("../firebase");

class Users {
    static updateUser(userId, newData) {
        return db.ref('users/' + userId).set(newData);
    }
}

module.exports = { Users };