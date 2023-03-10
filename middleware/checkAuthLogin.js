const jwt = require('jsonwebtoken');
const User = require('../service/schemas/users');  
const secret = process.env.SECRET_KEY;


const checkUserLogin = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, secret);

    const user = await User.findOne({_id: decoded.id});

    if (!user) {
        throw new Error("User cannot find!!");
    }

    req.token = token;
    req.user = user;
    req.userID = user._id;
    next()
  } catch (e) {
    console.log(e);
      res.status(401).send({error: 'Authentication problem!!'})
  }
};

module.exports = {checkUserLogin};