require('dotenv').config() 
const express = require('express');
const expressLayouts = require('express-ejs-layouts')
const path = require('path');
const mongoose = require('mongoose');
const MongoDbStore = require('connect-mongo');

const app = express();

const PORT = process.env.PORT ||  8000;

mongoose.connect(process.env.MONGO_URL);
mongoose.connection
    .once('open', function () {
      console.log('MongoDB running');
    })
    .on('error', function (err) {
      console.log(err);
}); 

let mongoStore =  MongoDbStore.create({
    mongoUrl: process.env.MONGO_URL
});

const cookieParser = require("cookie-parser");
const session = require('express-session');

const Oneday = 1000 * 60 * 60 * 24 ;
app.use(session({
    secret: process.env.COOKIE_SECRET,
    saveUninitialized:true,
    store: mongoStore,
    cookie: { maxAge: Oneday },
    resave: false 
}))

const productRouter = require('./routes/productRouter');
const authRouter = require('./routes/authRouter');
const customerRouter =require('./routes/customerRouter')

// Asserts
app.use(express.static('public'));
app.use(express.urlencoded({ extended : false}));
app.use(express.json());

// Global middleware
app.use((req, res, next) => {
    res.locals.session = req.session,
    res.locals.user = req.user
    next();
})

// Set Template engine
app.use(expressLayouts);
app.set('views', path.join(__dirname, '/public/views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {    
    res.status(200).render('home');
});

app.use('/', productRouter);
app.use('/', authRouter);
app.use('/', customerRouter);

const server = app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});