const jwt = require('jsonwebtoken');
const User = require('../service/schemas/users');  
const secret = process.env.SECRET_KEY;


const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    if(!token) {
      res.status(401).json({"message": "Unauthorised."})
    }
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

module.exports = {auth};