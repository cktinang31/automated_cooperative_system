const express = require('express');
const { Client } = require('pg');
const morgan = require('morgan');
 
//express app
const app = express();
// const port = 3000;
 
// postgre database
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'Cooperativedb',
    password: 'Ctugk3nd3s',
    port: 5432,
})
 
client.connect()
.then(() => {
    console.log('Connected to PostgreSQL database');
    app.listen(3000, () => {
        console.log('Server running on port 3000');
    });
})
.catch(err => console.error('Error connecting to PostgreSQL database', err));

// register view engine
app.set('view engine', 'ejs');

// midddlware & static files
app.use(express.static('public'));

app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.render('index', { title: 'Home'});
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About'});
});

app.get('/service', (req, res) => {
    res.render('service', { title: 'Services'});
});

app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact Us'});
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Login'});
});

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404'})
});

