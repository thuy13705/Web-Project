const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const authRouter = require('./routes/auth');
const flash = require('connect-flash');
const MongoDBStore = require('connect-mongodb-session')(session);

const app = express();



var configDB=require('./config/database.js');

mongoose.connect(configDB.url, {
  useNewUrlParser: true, 
  useUnifiedTopology: true
});

app.set('views','./view');
app.use(express.static('public'));
app.set('view engine', 'ejs');



// view engine setup 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash());
app.use(
  session({
    secret: 'notsecret',
    saveUninitialized: true,
    resave: false,
    store: new MongoDBStore({ uri: process.env.DB, collection: 'sessions' }),
    cookie: { maxAge: 180 * 60 * 1000 }
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(authRouter);

// pass passport for configuration
require('./config/passport')(passport);

app.use('/', require('./routes/index'));
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on PORT ${port}`);
});


