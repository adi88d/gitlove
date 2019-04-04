const fetch = require('node-fetch');
const { Users } = require("./collections/users");
const githubResponseMock = require('./github-response-mock.json');

function getGithubData(username) {
    return getGithubApi(username)
        .then(json => {
            const languages = getLanguages();
            const repos = getRepos();

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

    const userLang = Users.getUser(userId);
    var lang = await userLang.get().then(res => {
        return res.data().languages;
    });

    var response = [];
    Users.getAll().get()
        .then(users => {
            users.docs.filter(user => user.id != userId).forEach(user => {
                var commonlanguages = lang.filter(value => {
                    var languages = user.data().languages

                    if (languages && languages.includes(value)) {
                        return true
                    }
                    return false
                });

                response.push({
                    usedId: user.id,
                    rank: commonlanguages.length,
                    languages: commonlanguages
                })
            });
            response.sort(function (a, b) {
                return a.rank - b.rank;
            });

            console.log(response)
            return response;
        });
}

module.exports = {
    getGithubData,
    matchUsers
}