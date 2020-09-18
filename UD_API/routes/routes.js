const user = require('../models/user');

module.exports = {
    configure: function(app) {
        app.get('/user', function(req, res) {
            user.get(res);
        });

        app.get('/user/read', function(req, res) {
            user.read(res);
        });
        app.post('/user/create', function(req, res) {
            user.create(req.body, res);
        });
    }
}