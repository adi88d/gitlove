const fetch = require('node-fetch');

function getLanguages(username) {
    return fetch('https://api.github.com/users/' + username +'/repos')
        .then(res => res.json())
        .then(json => {
            var data  = json.map(item => item.language).filter(item => item != null);
            var languages = new Set(data);
            return languages;
        });
}


module.exports = {
    getLanguages
}