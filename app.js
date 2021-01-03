const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const teacherRouter = require('./routes/teacher');
const flash = require('connect-flash');
const multer = require('multer');
const path = require('path');
const MongoDBStore = require('connect-mongodb-session')(session);

const app = express();



var configDB=require('./config/database.js');

mongoose.connect(configDB.url, {
  useNewUrlParser: true, 
  useUnifiedTopology: true
});
var Storage= multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
  }
});

var video= multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/videos')
  },
  filename: function (req, filevideo, cb) {
    cb(null,filevideo.fieldname+"_"+Date.now()+path.extname(filevideo.originalname));
  }
});

app.use(require("./middlewares/course"));
app.use(multer({storage: Storage}).single('image'));
app.use(multer({storage: video}).single('video'));
app.use('/images',express.static(path.join(__dirname, 'public')));
app.set('views','./view');
app.use(express.static('public'));
app.use('/images',express.static(path.join(__dirname, 'public')));
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
app.use(adminRouter);
app.use(teacherRouter);
// pass passport for configuration
require('./config/passport')(passport);

app.use('/', require('./routes/index'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on PORT ${port}`);
});


