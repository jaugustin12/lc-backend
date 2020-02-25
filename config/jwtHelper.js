const jwt = require('jsonwebtoken');

exports.jwtEncode = payload => {
  return jwt.sign({payload}, 'anything');
}

exports.verifyJwtToken = (req, res, next) => {
  if ('authorization' in req.headers) {
    const token = req.headers['authorization'].split(' ')[1];
    jwt.verify(token, 'anything',
      (err, decoded) => {
        if (err) {
          res.status(401).send({ auth: false, message: 'Token authentication failed.' });
        }
        else {
          req.user = decoded;
          next();
        }
      })
  } else {
    res.status(403).send({ auth: false, message: 'No token provided.' });
  }
}
