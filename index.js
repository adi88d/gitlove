const {app} = require("./express.js");

app.get('/', (req, res) => res.send('Hello World!'));