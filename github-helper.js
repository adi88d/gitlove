const fetch = require('node-fetch');
const {Users} = require("./collections/users");

function getLanguages(username) {
    return fetch('https://api.github.com/users/' + username +'/repos')
        .then(res => res.json())
        .then(json => {
            if (json.map) {
                var data  = json.map(item => item.language).filter(item => item != null);
                var languages = new Set(data);
                
                return languages;
            } else {
                return new Set();
            }
        });
}

async function matchUsers(userId){

    const userLang = Users.getUser(userId);
    var lang = await userLang.get().then(res =>  {
        return res.data().languages;
    });

    var response=[];
    Users.getAll().get()
        .then(users => {
            users.docs.filter(user=> user.id != userId).forEach(user => {
                var commonlanguages = lang.filter(value => {
                    var languages = user.data().languages
                    
                    if(languages && languages.includes(value)){
                        return true
                    }
                    return false       
                });

                response.push({
                    usedId: user.id,
                    rank: commonlanguages.length,
                    languages:commonlanguages
                }) 
            });
            response.sort(function(a, b) {
                return a.rank - b.rank;
              });

            console.log(response)
            return response;
        });
}

module.exports = {
    getLanguages,
    matchUsers
}