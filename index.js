const { app } = require("./express.js");
const { getGithubData, matchUsers } = require("./github-helper.js");
const { Users } = require("./collections/users");
const { getRestaurants } = require("./tenbis/index");
var bodyParser = require('body-parser');

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/getMatches/:userId", (req, res) => {
    matchUsers(req.params.userId)
    .then(results => {
        res.send(results)
    })
});

app.post("/updateProfile", (req, res) => {
    const {
            gitUsername,
            username,
            userId,
            tenBisEmail,
            tenBisPassword
    } = req.body;

    Promise.all([
        getGithubData(gitUsername),
        getRestaurants(tenBisEmail, tenBisPassword)
    ]).then(results => {
        return Users.getUser(userId).update({
            languages: results[0].languages,
            repos: results[0].repos,
            restaurants: results[1],
            gitUsername: gitUsername,
            name: username
        });
    })
    .then(() => {
        res.send("cool")
    })
});

matchUsers('QABItfq1u84qrOi1HbQx')