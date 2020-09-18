var express = require('express');
var router = express.Router();
var mysql = require('mysql');


var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test',
})
con.connect(function(err) {
        if (err) throw err;
        console.log('đã kết nối thành công!');
    })
    /* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
router.get('/customer', function(req, res, next) {
    var sql = "SELECT * FROM customer";
    con.query(sql, function(err, results, fields) {
        if (err) throw err;
        res.end(JSON.stringify(results));
    })
});
router.get('/customer/:id', function(req, res, next) {
    var sql = "SELECT * FROM customer WHERE Id =?";
    con.query(sql, [req.params.id], function(err, results, fields) {
        if (err) throw err;
        res.end(JSON.stringify(results));
    })
});
router.post('/customer', function(req, res, next) {
    var params = req.body;
    var sql = "INSERT INTO customer SET ?";
    con.query(sql, params, function(err, results, fields) {
        if (err) throw err;
        res.end(JSON.stringify(results));
    })
});
module.exports = router;