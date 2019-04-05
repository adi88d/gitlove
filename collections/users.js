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
        const userRef = this.getUser(userId);
        return userRef.get().then((user)=>{
            user = user.data();
            return this.getUser(matchedId).get().then((matchedUser)=>{
                matchedUser = matchedUser.data();
        
                const matches = user.matches || [];
                if (matches.indexOf(matchedId) === -1) {
                    matches.push(matchedId);
                    userRef.update({ matches });
                }
        
                if (matchedUser.matches && matchedUser.matches.indexOf(userId) !== -1) {
                    return {
                        match: true,
                        restaurant: getCommonRestaurant(user, matchedUser),
                        user: matchedUser
                    };
                }
        
                return { match: false };
            
            });
        });
    }
}

function getCommonRestaurant(userA, userB) {
    const restaurantA = userA.restaurants || [];
    const restaurantB = userB.restaurants || [];
    for (let i = 0; i < restaurantA.length; i++) {
        if (restaurantB.indexOf(restaurantA[i] !== -1))
            return restaurantA[i];
    }
}

module.exports = { Users };