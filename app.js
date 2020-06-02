//jshint esversion:6
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const connexion = require('./database/db');
const bycrypt = require('bcrypt');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// When someone go to the homepage
app.get('/', (req, res) => {
	res.render('home');
});

// When someone go to the login page
app.get('/login', (req, res) => {
	res.render('login');
});

// When someone try to connect
app.post('/login', (req, res) => {
	// Infos provid by the user
	const email = req.body.username;
	const passwordForm = req.body.password;

	// Find if the user exist
	let sql = "SELECT * FROM user  WHERE email = '" + email + "'";
	connexion.query(sql, function (err, result) {
		if (err) throw err;
		console.log(result);
		// If email is in the database
		if (result[0]) {
			// Compare the password that user provide with password in the database
			hash = result[0].password;
			let isPassword = bycrypt.compareSync(passwordForm, hash);
			isPassword ? res.render('secrets') : console.log('WRONG PASSWORD');
		} else {
			console.log('NO USER FOUND');
			res.redirect('/login');
		}
	});
});

// When someone go to the register page
app.get('/register', (req, res) => {
	res.render('register');
});

// When someone try to register
app.post('/register', (req, res) => {
	// Information retrive to the register form
	const email = req.body.username;
	const password = req.body.password;
	const saltRounds = 10;

	// hash the password
	const hashPasswsord = bycrypt.hashSync(password, saltRounds);
	console.log(hashPasswsord);
	

	let sql = "INSERT INTO user (email, password) VALUES ('" + email + "','" + hashPasswsord + "')";

		connexion.query(sql, function (err, result) {
		if (err) throw err;
		console.log(result);
		res.render('secrets');
	});
});

const PORT = 8080;
app.listen(PORT, () => {
	console.log(`Server started on PORT ${PORT}`);
});
