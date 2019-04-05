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

    var userLang = user.data().languages || [];
    var userRest =  user.data().restaurants || [];
    var userRepos =  user.data().repos || [];

    var response = [];
    return await Users.getAll().get()
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

                var commonrepos = userRepos.filter(value => {
                    var repos = user.data().repos
                    
                    if(repos && repos.includes(value)){
                        return true
                    }
                    return false       
                });

                finalRank = commonrestaurants.length + commonlanguages.length + commonrepos.length

                response.push({
                    usedId: user.id,
                    username:user.data().name,
                    profilePic:user.data().profilePic,
                    rank: finalRank,
                    resRank: commonrestaurants.length,
                    langRank: commonlanguages.length,
                    reposRank: commonrepos.length,  
                    restaurants:commonrestaurants,
                    languages:commonlanguages,
                    repos: commonrepos
                }) 
            });

            response.sort(function(a, b) {
                return b.rank - a.rank;
              });

            //console.log(response)
            return response;
        });
}

module.exports = {
    getGithubData,
    matchUsers
}