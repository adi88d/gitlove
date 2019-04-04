const { app } = require("./express.js");
const { getLanguages } = require("./github-helper.js");
const { Users } = require("./collections/users");

app.get("/", (req, res) => res.send("Hello World!"));
app.get("/filllanguage/:name/:userId", (req, res) => {
    return getLanguages(req.params.name).then(languages => {
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
