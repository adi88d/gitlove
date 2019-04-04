const {app} = require("./express.js");
const {getLanguages} = require("./github-helper.js");

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/getLanguage/:name', (req, res) => {
    return getLanguages(req.params.name)
        .then(languages => {
            console.log(languages);
            res.send([...languages]);
        });
})