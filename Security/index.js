const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
// const _ = require('lodash');
const passport = require('passport');
const passportJWT = require('passport-jwt');
let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = '123gido%khong^nen*biet';
// lets create our strategy for web token
let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    console.log('payload received', jwt_payload);
    let user = getUser({ id: jwt_payload.id });
    if (user) {
        next(null, user);
    } else {
        next(null, false);
    }
});
// Sử dụng strategy
passport.use(strategy);
const app = express();
cors = require('cors');
app.use(cors({
    origin: 'http://localhost:4200',
}));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    next();

})

// initialize passport with express
app.use(passport.initialize());
// parse application/json
app.use(bodyParser.json());
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
const Sequelize = require('sequelize');
// initialze an instance of Sequelize
const sequelize = new Sequelize({
    database: 'mysql_node',
    username: 'root',
    password: '',
    dialect: 'mysql',
});
// check the databse connection
sequelize
    .authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch(err => console.error('Unable to connect to the database:', err));
// create user model
const User = sequelize.define('user', {
    name: {
        type: Sequelize.STRING,
    },
    // password: {
    //     type: Sequelize.STRING,
    // },
    price: {
        type: Sequelize.FLOAT,
    }
});

// create table with user model
User.sync({ force: true })
    .then(() => console.log('User table created successfully'))
    .catch(err => console.log('oooh, did you enter wrong database credentials?'));
// create some helper functions to work on the database
const createUser = async({ name, price }) => {
    return await User.create({ name, price });

};

const getAllUsers = async() => {
    return await User.findAll();
};
const getUser = async obj => {
    return await User.findOne({
        where: obj,
    });
};

// set some basic routes
app.get('/', async function(req, res) {
    res.json({ message: 'Express is up!' });

    // let datas = await getAllUsers();
    // res.json(datas);
});
app.get('/user/:id', (req, res) => {
    let id = req.params.id;
    getUser({ where: { id: id } }).then(user => res.json(user))
});
// get all users
app.get('/users', function(req, res) {
    getAllUsers().then(user => res.json(user));
});
// register route
app.post('/register', function(req, res, next) {

    const { name, price } = req.body;
    createUser({ name, price }).then(user =>
        res.json({ user, msg: 'account created successfully' })
    );
});
app.put('/update/:id', (req, res, next) => {


    console.log(req.body);

    let id = req.params.id;

    User.update(req.body, {
            where: { id: id }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Cập nhật thành công."
                });
            } else {
                res.send({
                    message: `Lỗi cập nhật id=${id}. Không tìm thấy dữ liệu hợp lệ`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Không thể cập nhật id=" + id
            });
        });


});
app.delete('/delete/:id', (req, res, next) => {
        let id = req.params.id;
        User.destroy({
                where: { id: id }
            })
            .then(num => {
                if (num == 1) {
                    res.send({
                        message: 'Cập nhật thành công'
                    })
                } else {
                    res.send({
                        message: `Không thể xóa dữ liệu id = ${id}`
                    });
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: `Không thể xóa dữ liệu id = ${id}`
                })
            });


    })
    //login route
app.post('/login', async function(req, res, next) {
    const { name, price } = req.body;
    if (name && price) {
        let user = await getUser({ name: name });
        if (!user) {
            res.status(401).json({ message: 'No such user found' });
        }
        if (user.password === password) {
            // from now on we'll identify the user by the id and the id is the
            // only personalized value that goes into our token
            // let payload = { id: user.id };
            // let token = jwt.sign(payload, jwtOptions.secretOrKey);
            // res.json({ msg: 'ok', token: token });

        } else {
            res.status(401).json({ msg: 'Password is incorrect' });
        }
    }
});
// protected route
app.get('/protected', passport.authenticate('jwt', { session: false }), function(req, res) {
    res.json('Success! You can now see this without a token.');
});
// start app
app.listen(3000, function() {
    console.log('Express is running on port 3000');
});