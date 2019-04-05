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
    /*matchUsers(req.params.userId)
        .then(results => {
            res.send(results)
        })
        */
       res.send([{
        usedId: "f1wR5ZPBAnLU5j7LiQs",
        username: "James Bond",
        profilePic: "https://vignette.wikia.nocookie.net/jamesbond/images/d/dc/James_Bond_%28Pierce_Brosnan%29_-_Profile.jpg/revision/latest?cb=20130506224906",
        rank: 97,
        resRank: 0,
        langRank: 1,
        reposRank: 3,
        restaurants: [ ],
        languages: [
        "cat-lover",
        "duck-rubber",
        "php",
        "html"
        ],
        repos: [
        "angular-translate",
        "GIC",
        "okcupidproxy"
        ],
        restaurants: [
            {
            id: "25438",
            name: "קפטן בורגר "
            },
            {
            name: "גומבה",
            id: "24451"
            },
            {
            id: "24451",
            name: "גומבה"
            },
            {
            name: "ארומה בתל אביב",
            id: "1616"
            },
            {
            name: "סולי - Soli",
            id: "24584"
            },
            {
            name: "חור בהשכלה",
            id: "7524"
            },
            {
            name: "ארומה בתל אביב",
            id: "1616"
            },
            {
            id: "21656",
            name: "פליישמן מנחם בגין"
            }
            ]
        },
        {
            usedId: "f1wR5ZPBAnLjo7LiQs",
            username: "Adi Daud",
            profilePic: "https://scontent.ftlv1-1.fna.fbcdn.net/v/t1.0-9/51773411_10156211509398683_2300813684114456576_o.jpg?_nc_cat=100&_nc_ht=scontent.ftlv1-1.fna&oh=7fa4fb8b767bda65057618a500364fb8&oe=5D049B11",
            rank: 90,
            resRank: 0,
            langRank: 1,
            reposRank: 3,
            restaurants: [ ],
            languages: [
            "giraffe",
            "topolopompo",
            "php",
            "java"
            ],
            repos: [
            "angular-translate",
            "GIC",
            "okcupidproxy"
            ]
            },
            {
                usedId: "f1wR5ZPBAnLdsU5jo7LiQs",
                username: "Ephi Gabay",
                profilePic: "https://graph.facebook.com/10218258292545967/picture?width=800",
                rank: 82,
                resRank: 0,
                langRank: 1,
                reposRank: 3,
                restaurants: [ ],
                languages: [
                "fish-feeder",
                "c-sharp",
                "scala",
                "go"
                ],
                repos: [
                "angular-translate",
                "GIC",
                "okcupidproxy"
                ]
                },
                {
                    usedId: "f1wR5ZPwinLU5jo7LiQs",
                    username: "Joey Tribbiani",
                    profilePic: "https://upload.wikimedia.org/wikipedia/en/d/da/Matt_LeBlanc_as_Joey_Tribbiani.jpg",
                    rank: 77,
                    resRank: 0,
                    langRank: 1,
                    reposRank: 3,
                    restaurants: [ ],
                    languages: [
                    "italian",
                    "node-js",
                    "python"
                    ],
                    repos: [
                    "angular-translate",
                    "GIC",
                    "okcupidproxy"
                    ]
                    },
                    {
                        usedId: "1555ZPBAnLU5jo7LiQs",
                        username: "dror Globerman",
                        profilePic: "http://conferences.themarker.com/wp-content/uploads/2018/04/%D7%93%D7%A8%D7%95%D7%A8-%D7%92%D7%9C%D7%95%D7%91%D7%A8%D7%9E%D7%9F.jpg",
                        rank: 75,
                        resRank: 0,
                        langRank: 1,
                        reposRank: 3,
                        restaurants: [ ],
                        languages: [
                        "cpp",
                        "node-js",
                        "python"
                        ],
                        repos: [
                        "angular-translate",
                        "GIC",
                        "okcupidproxy"
                        ]
                        },
                        {
                            usedId: "f1wR5ZfqeLU5jo7LiQs",
                            username: "mark zuckerberg",
                            profilePic: "https://s.hswstatic.com/gif/gettyimages-474639991.jpg",
                            rank: 70,
                            resRank: 0,
                            langRank: 1,
                            reposRank: 3,
                            restaurants: [ ],
                            languages: [
                            "dog-friendly",
                            "ovad",
                            "linux",
                            "js"
                            ],
                            repos: [
                            "angular-translate",
                            "GIC",
                            "okcupidproxy"
                            ]
                            }
            ]);
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
            isTab: results[0].isTabs,
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

app.post("/match", (req, res) => {

    const {
        userId,
        matchedId
    } = req.body;

    Users.updateMatch(userId, matchedId).then(result => res.send(result));
});
