require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const MongoDbStore = require('connect-mongo');
const flash = require('express-flash');
const passport = require('passport');
const { Server } = require('socket.io');
const Emitter = require('events');
const cookieParser = require("cookie-parser");
const session = require('express-session');

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

// Event Emitter
const eventEmitter = new Emitter();
app.set('eventEmitter' , eventEmitter);
 

 

const Oneday = 1000 * 60 * 60 * 24 ;
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: Oneday }
}));

const passportInit = require('./app/config/passport')
passportInit(passport);
app.use(passport.initialize())
app.use(passport.session())
app.use(cors());
app.use(flash());
 

const productRouter = require('./routes/productRouter');
const authRouter = require('./routes/authRouter');
const customerRouter =require('./routes/customerRouter')
const adminRouter = require('./routes/adminRouter');
const paymentRouter = require("./routes/payment");

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
app.use('/', adminRouter);
app.use('/', paymentRouter);

const server = app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});

const io = new Server(server);
io.on('connection', (socket) =>{
    //Join
    socket.on('join', (orderId) => {
        socket.join(orderId);
    });
});

eventEmitter.on('orderUpdated' , (data) => {
     io.to(`order_${data.id}`).emit('orderUpdated',data);
})


eventEmitter.on('orderChanged', (action ,data) => {
    io.to('adminRoom').emit('orderChanged', action, data);
})