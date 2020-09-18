var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

var mysql = require('mysql');
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'thuchanh1'
})
con.connect((err) => {
    if (err) throw err;
    console.log('Connected server!');
})




app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//Hiển thị dữ liệu
app.get('/', (req, res) => {
    let sql = 'SELECT * FROM product';
    con.query(sql, (err, results) => {
        if (err) throw err;
        res.render('index', { title: 'HOME', data: results })
    })
});
//chèn dữ liệu
app.post('/', (req, res) => {
    let sql = 'INSERT INTO product(id_pd,name,price) VALUES ?';
    var values = [
        [req.body.id, req.body.name, req.body.price],
    ];
    con.query(sql, [values], (err, results) => {
        if (err) throw err;
        res.redirect('/');
    })
});
//Xóa dữ liệu
app.get('/delete/:id', (req, res) => {
    let sql = 'DELETE FROM product WHERE id_pd = ?';
    con.query(sql, [req.params.id], (err, results) => {
        if (err) throw err;
        res.redirect('/');
    })
});
//Sửa dữ liệu
app.get('/edit/:id', (req, res) => {
    let sql = 'SELECT * FROM product WHERE id_pd = ?';
    con.query(sql, [req.params.id], (err, results) => {
        if (err) throw err;
        res.render('edit', { title: 'EDIT', data: results });
    })
});
app.post('/edit/:id', (req, res) => {
    let sql = 'UPDATE product SET id_pd = ' + '"' + req.body.id + '"' + ',' + 'name = ' + '"' + req.body.name + '"' + ',' + ' price = ' + '"' + req.body.price + '"' + ' WHERE id_pd = ' + '"' + req.params.id + '"';
    con.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    })
});
//Hiển thị chi tiết sản phẩm
app.get('/show_details/:id', (req, res) => {
    let sql = 'SELECT * FROM product WHERE id_pd = ?';
    con.query(sql, [req.params.id], (err, results) => {
        if (err) throw err;
        res.render('show_details', { title: 'Details', data: results });
    })
});
app.listen(3000);