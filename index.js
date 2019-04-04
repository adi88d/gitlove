const { app } = require("./express.js");
const { getLanguages } = require("./github-helper.js");
const { Users } = require("./collections/users");
const { getRestaurants } = require("./tenbis/index");

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/", (req, res) => res.send("Hello World!"));
app.get("/filllanguage/:githubUsername/:userId", (req, res) => {
    return getLanguages(req.params.githubUsername)
        .then(languages => {
            const user = Users.getUser(req.params.userId)
            user.set({
                languages: [...languages]
            })
            .then(() => user.get())
            .then(user => {
                res.send(user.data());
            })
            .catch(error => console.log(error));
        });
});



getRestaurants("email@gmail.com", 'password')
    .then(restaurants => {
        console.log(restaurants);
    })