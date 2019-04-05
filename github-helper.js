const fetch = require('node-fetch');
const { Users } = require("./collections/users");
const githubUserMock = require('./mocks/user.json');
const githubEventsMock = require('./mocks/events.json');

function getGithubData(username) {
    
    const result = {};

    return getGithubApi(username)
        .then(json => {
            const languages = getLanguages(json);
            const repos = getRepos(json);

            result.languages = languages;
            result.repos = repos;
        })
        .then(() => {
            return getIsTabs(username);
        })
        .then(isTabs => {
            result.isTabs = isTabs;
            return result;
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
    return Promise.resolve(githubUserMock);

    return fetch("https://api.github.com/users/" + username + "/repos")
        .then(res => res.json());
}

function getIsTabs(username) {
    // this code doesn't really work
    return Promise.resolve(githubEventsMock)
    // return fetch("https://api.github.com/users/" + username + "/events")
    //     .then(res => res.json())
        .then(data => {
            return JSON.stringify(data, null, "\t");
        })
        .then(events => {
            const urls = [events.match(/"https:\/\/api\.github\.com\/repos\/.*?\/.*?\/commits\/.*?"/g)[0]];
            return Promise.all(urls.map(url => fetch(url.replace(/"/g, ""))))
        })
        .then(results => Promise.all(results.map(result => result.json())))
        .then(results => {
            return results.map(result => result.files);
        })
        .then(results => {
            return [].concat.apply([], results);
        })
        .then(results => {
            return results.map(result => result.patch);
        })
        .then(patches => {
            return patches.some(patch => !!patch.match(/\t/))
        });
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
                    var restaurants = user.data().restaurants
                    
                    if(restaurants && restaurants.map(r=>r.id).includes(value.id)){
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

                sum = commonrestaurants.length + commonlanguages.length + commonrepos.length

                var finalRank;

                if(sum>40){
                    finalRank=100;
                }
                else{
                    finalRank= Math.floor(Math.random() * (100 - 60) + 60)
                }


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

            /*
            response.sort(function(a, b) {
                return b.rank - a.rank;
              });
              */

              

            return response;
        });
}

module.exports = {
    getGithubData,
    matchUsers
}