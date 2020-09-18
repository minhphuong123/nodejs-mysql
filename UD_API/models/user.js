const connection = require('../libraries/connection');

function User() {
    this.get = function(res) {
        connection.acquire(function(err, conn) {
            conn.query('SELECT * FROM sanphambanchay', function(err, result) {
                if (err) throw err;
                conn.release();
                res.send(result);
            });
        });
    };
    this.create = function(field_data, res) {
        connection.acquire(function(err, conn) {
            conn.query('INSERT INTO sanphambanchay set ?', field_data, function(err, result) {
                conn.release();
                if (err) {
                    res.send({ status: 1, message: 'User creation failed' });
                } else {
                    res.send({ status: 0, message: 'User creation success' });
                }
            })
        });
    };
    this.update = function(field_data, res) {
        connection.acquire(function(err, conn) {
            conn.query('UPDATE sanphambanchay set ? WHERE Id = ?', [field_data, field_data.Id], function(err, result) {
                conn.release();
                if (err) {
                    res.send({ status: 1, message: 'User update failse' });
                } else {
                    res.send({ status: 0, message: 'User update success' });
                }
            });
        });
    };
    this.read = function(res) {
        connection.acquire(function(err, conn) {
            conn.query('SELECT * FROM sanphambanchay', function(err, result) {
                conn.release();
                res.send(result);
            });
        });
    };
    this.delete = function(id, res) {
        connection.acquire(function(err, conn) {
            conn.query('DELETE sanphambanchay WHERE Id = ?', [id], function(err, result) {
                conn.release();
                if (err) {
                    res.send({ status: 1, message: 'Delete failse' });
                } else {
                    res.send({ status: 0, message: 'Delete success' });
                }
            });
        });
    };

}

module.exports = new User();