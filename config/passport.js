// passport configuration
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var bcrypt = require('bcryptjs');
var configAuth=require('../config/facebook');
var nodemailer = require('nodemailer');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findOne({
      _id: id
    })
      .then(function(user) {
        done(null, user);
      })
      .catch(function(err) {
        console.log(err);
      });
  });

  passport.use(
    'local-signin',
    new LocalStrategy({
      usernameField: 'email',    // define the parameter in req.body that passport can use as username and password
      passwordField: 'password'
    },
      function(email, password, done) {
      User.findOne({ email: email }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: 'Sai email hoặc mật khẩu.'
          });
        }

        if (user.isLock) {
          return done(null, false, {
            message: 'Tài khoản đã bị khoá.'
          });
        }
        console.log("dd:",user.email,user.password);
        bcrypt.compare(password, user.password, function(err, result) {
          if (err) {
            return done(err);
          }
          console.log('acc : ' + user.email + ' ' + user.password + ' ' + password, result);
          if (!result) {
            return done(null, false, {
              message: 'Sai email hoặc mật khẩu.'
            });
          }
          return done(null, user);
        });
      });
    })
  );

  passport.use('facebook',new FacebookStrategy({
    // điền thông tin để xác thực với Facebook.
    // những thông tin này đã được điền ở file auth.js
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
    profileFields: ['id','displayName','email','first_name','last_name','middle_name']
},
// Facebook sẽ gửi lại chuối token và thông tin profile của user
function (token, refreshToken, profile, done) {
    // asynchronous
    process.nextTick(function () {
        // tìm trong db xem có user nào đã sử dụng facebook id này chưa
        User.findOne({'facebook.id': profile.id}, function (err, user) {
            if (err)
                return done(err);
            // Nếu tìm thấy user, cho họ đăng nhập
            if (user) {
                return done(null, user); // user found, return that user
            } else {
                // nếu chưa có, tạo mới user
                var newUser = new User();
                // lưu các thông tin cho user
                newUser.name = profile.name.givenName + ' ' + profile.name.familyName; // bạn có thể log đối tượng profile để xem cấu trúc
                newUser.email= profile.emails[0].value; // fb có thể trả lại nhiều email, chúng ta lấy cái đầu tiền
                // lưu vào db
                newUser.save(function (err) {
                    if (err)
                        throw err;
                    // nếu thành công, trả lại user
                    return done(null, newUser);
                });
            }
        });
    });
}));

  passport.use(
    'local-signup',
    new LocalStrategy({ passReqToCallback: true }, function(req, username, password, done) {
      User.findOne({ username: username }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, false, {
            message: 'Tên đăng nhập đã tồn tại!'
          });
        }

        if (password.length <= 6) {
          return done(null, false, {
            message: 'Mật khẩu phải trên 6 ký tự!'
          });
        }

        if (password !== req.body.password2) {
          return done(null, false, {
            message: 'Hai mật khẩu không khớp!'
          });
        }
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(req.body.email).toLowerCase())) {
          return done(null, false, {
            message: 'Địa chỉ email không hợp lệ!'
          });
        }
        User.findOne({ email: req.body.email }, (err, user) => {
          if (err) {
            return done(err);
          } else if (user) {
            return done(null, false, {
              message: 'Địa chỉ email đã tồn tại!'
            });
          }
        });

        bcrypt.hash(password, 12).then(hashPassword => {
          const newUser = new User({
            username: username,
            password: hashPassword,
            email: req.body.email
          });
          // save the user
          newUser.save(function(err) {
            if (err) return done(err);
            return done(null, newUser);
          });
        });
      });
    })
  );
};