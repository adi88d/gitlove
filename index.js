const { app } = require("./express.js");
const { getLanguages } = require("./github-helper.js");
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
app.post("/updateProfile", (req, res) => {
    const gitUsername = req.body.gitUsername;
    const username = req.body.username;
    const userId = req.body.userId;

    Promise.all([
        getLanguages(gitUsername),
        getRestaurants("someemail@gmail.com", "password")
    ]).then(results => {
        return Users.getUser(userId).set({
            languages: Array.from(results[0]),
            restaurants: results[1].map(r => r.id),
            name: username
        });
    })
    .then(() => {
        res.send("cool")
    })
});
// app.get("/filllanguage/:githubUsername/:userId", (req, res) => {
//     return 
//         .then(languages => {
//             const user = Users.getUser(req.params.userId)
//             user.set({
//                 languages: [...languages]
//             })
//             .then(() => user.get())
//             .then(user => {
//                 res.send(user.data());
//             })
//             .catch(error => console.log(error));
//         });
// });