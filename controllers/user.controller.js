const mongoose = require('mongoose');
const User = mongoose.model('User');
const _ = require('lodash');
const Event = mongoose.model('Event');
const { jwtEncode } = require('../config/jwtHelper');
const jwt = require('jsonwebtoken');
const randtoken = require('rand-token');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const refreshTokens = {};
const SECRET = 'anything';
const passportOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET
};

passport.use(new JwtStrategy(passportOpts, function (jwtPayload, done) {
  const expirationDate = new Date(jwtPayload.exp * 1000);
  if(expirationDate < new Date()) {
    return done(null, false);
  }
  done(null, jwtPayload);
}));

passport.serializeUser(function (user, done) {
  done(null, user.username)
});

module.exports.users = (req, res) => {
  User.find({}, function (err, users) {
    if (err) {
      throw err;
    }
    res.status(200).send(users);
  })
}

module.exports.posts = (req, res) => {
  Event.find({promoter: req.body.email}, (err, posts) => {
    if (err) {
      res.send(err);
    }
    res.status(200).send(posts);
  })
}

module.exports.register = (req, res) => {
  User.create({
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password
  })
    .then(user => {
      const { email, fullName } = user;
      const payload = { email, fullName };
      res.status(200).json({ 'user': 'Added successfully', token: jwtEncode(payload) });
    })
    .catch(err => {
      if (err.code == 11000)
        res.status(422).send(['Duplicate email address found.']);
      else {
        res.status(400).send('Failed to create new record');
      }
    });
}

module.exports.authenticate =  (req, res, next) => {
  const { email, password } = req.body; //object destruturing
  User.findOne({ email: email}, async (err, user) => {
    if (err) {
      err => res.send(err);
    }
    if (!user) {
      res.send('no User');
    }
    if (user) {
      user.verifyPassword(password, user.password)
        .then((isValid) => {
          if (!isValid) {
            return res.status(401).send({ msg: 'Wrong username or password' });
          }

          const { email, fullName } = user;
          const payload = { email, fullName };
          const jwtToken = jwt.sign(payload, 'anything', {expiresIn: 500});
          const refreshToken = randtoken.uid(256);
          refreshTokens[refreshToken] = payload;
          return res.status(200).send({ msg: 'Login successful', jwt: jwtToken, refreshToken: refreshToken });
        }).catch((err)=> {
          res.status(401).send(err);
        });
    }
  });
}

module.exports.logout = (req, res, next) => {
  const refreshToken = req.body.refreshToken;
  if (refreshToken in refreshTokens) {
    delete refreshTokens[refreshToken];
  }
  res.sendStatus(204);
}

module.exports.refresh = (req, res, next) => {
  const refreshToken = req.body.refreshToken;

  if (refreshToken in refreshTokens) {
    /* Possible error in assignment */
    const user = {
      'email': refreshTokens[refreshToken].email,
      'fullName': refreshTokens[refreshToken].fullName
    }
    const token = jwt.sign(user, 'anything', {expiresIn: 180});
    res.json({jwt: token})
  }
  else {
    res.sendStatus(401);
  }
}

module.exports.userProfile = (req, res, next) => {
  User.findOne({ email: req.user.email },
    (err, user) => {
      if (!user) {
        return res.status(404).json({ status: false, message: 'User record not found' });
      }
      else {
        return res.status(200).json({ status: true, user: user });
      }
    }
  );
}

module.exports.friendProfile = (req, res) => {
  var email = req.params.email;

  User.findOne({ email: email }, function (err, user) {
    if (err){
      return res.status(404).json({ status: false, message: err });
    }
    if (!user) {
      return res.status(404).json({ status: false, message: 'User record not found' });
    } else {
      Event
        .find({ responsible: email }, function (err, posts) {
          if (err) {
            res.sendStatus('Maybe mult ppl in different databases', err)
          }
        })
        .sort({ created_at: -1 })
        .exec(function (err, posts) {
          res.status(200).send({user, posts});
        });
    }
  });
}

module.exports.follow = (req, res) => {
  const userEmail = req.user.email;
  const following = req.body.email;
  User.findOne({email: userEmail}, function (err, user) {
    if(user) {
      user.relationships.following.push(following);
      User.findOne({email: following},
      function (err, user) {
        user.relationships.followers.push(userEmail);
        next();
        if (err) {
          res.send(err);
        }
      });
    }
    if(!user) {
      res.send('no user!!');
    }
    if (err) {
      res.send(err);
    }
  });

}
