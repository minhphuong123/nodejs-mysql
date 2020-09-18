const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./libraries/connection');
const routes = require('./routes/routes');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
})
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

connection.init();

routes.configure(app);

const server = app.listen(3000, () => {
    console.log('Server listening on port ' + server.address().port);
})