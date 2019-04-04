const fetch = require('node-fetch');

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


module.exports = {
    getLanguages
}