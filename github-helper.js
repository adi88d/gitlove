const fetch = require('node-fetch');
const { Users } = require("./collections/users");
const githubResponseMock = require('./github-response-mock.json');

function getGithubData(username) {
    return getGithubApi(username)
        .then(json => {
            const languages = getLanguages(json);
            const repos = getRepos(json);

            return {
                languages,
                repos
            }
        });
}

function getRepos(json) {
    if (json.map) {
        var data = json.map(item => item.name).filter(item => item != null);
        var Repos = new Set(data);

        return Array.from(Repos);
    } else {
        return [];
    }
}

function getLanguages(json) {
    if (json.map) {
        var data = json.map(item => item.language).filter(item => item != null);
        var languages = new Set(data);

        return Array.from(languages);
    } else {
        return [];
    }
}

function getGithubApi(username) {
    return Promise.resolve(githubResponseMock);

    return fetch("https://api.github.com/users/" + username + "/repos")
        .then(res => res.json());
}

async function matchUsers(userId) {

    const userRef = Users.getUser(userId);

    const user = await userRef.get();

    var userLang = user.data().languages;

    var userRest =  user.data().restaurants;

    var response = [];
    Users.getAll().get()
        .then(users => {
            users.docs.filter(user=> user.id != userId).forEach(user => {

                var commonlanguages = userLang.filter(value => {
                    var languages = user.data().languages

                    if (languages && languages.includes(value)) {
                        return true
                    }
                    return false
                });

                var commonrestaurants = userRest.filter(value => {
                    var restaurant = user.data().restaurants
                    
                    if(restaurant && restaurant.includes(value)){
                        return true
                    }
                    return false       
                });
                response.push({
                    usedId: user.id,
                    rank: commonrestaurants.length + commonlanguages.length,
                    resRank: commonrestaurants.length,
                    langRank: commonlanguages.length,  
                    restaurants:commonrestaurants,
                    languages:commonlanguages,
                }) 
            });

            response.sort(function(a, b) {
                return b.rank - a.rank;
              });

            console.log(response)
            return response;
        });
}

module.exports = {
    getGithubData,
    matchUsers
}