var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'thuchanh1'
});

//Insert data

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
router.get('/insert', function(req, res, next) {
    res.render('insert', { title: 'Insert' });
});

router.post('/insert', function(req, res, next) {


    con.connect(function(err) {


        var name = req.body.ten;
        var birthday = req.body.bd;
        var sex = req.body.sex;

        var sql = "INSERT INTO customer(Name,Birthday,Sex) " + "VALUES (" + "'" + name + "'" + "," + birthday + "," + "'" + sex + "'" + ")";
        con.query(sql, function(err, results) {
            res.redirect('/insert');
        }).on('error', function(err) {
            console.log("[mysql error]", err);
        });

    });
});
//Show data
router.get('/show', function(req, res, next) {
    var sql = 'SELECT * FROM customer';
    con.query(sql, function(err, results) {
        res.render('show', { title: 'Show', data: results });
    })
});
//Delete data
router.get('/delete/:id', function(req, res, next) {

    var id = req.params.id;
    var sql = "DELETE FROM customer WHERE ID = " + id;
    con.query(sql, function(err, results) {
        res.redirect('/show');
    })
});
//Edit data
router.get('/edit/:id', function(req, res, next) {

    var id = req.params.id;

    var sql = "SELECT * FROM customer WHERE ID = " + id;
    con.query(sql, function(err, results) {
        res.render('edit', { title: 'Edit data', data: results })
    })

});

router.post('/edit/:id', function(req, res, next) {

    con.connect(function(err) {
        var id = req.params.id;
        var name = req.body.ten;
        var birthday = req.body.bd;
        var sex = req.body.sex;
        var sql = "UPDATE customer SET Name = " + "'" + name + "'" + "," + "Birthday = " + birthday + "," + "Sex = " + "'" + sex + "'" + " WHERE ID = " + id;
        con.query(sql, function(err, results) {
            res.redirect('/show');
        }).on('error', function(err) {
            console.log("[mysql error]", err);
        });
    });


});
module.exports = router;