const service = require('../service/users');
const User = require('../service/schemas/users');
const secret = process.env.SECRET_KEY;
const jwt = require('jsonwebtoken');

const register = async (req, res, next) => {
  const {password, email} = req.body;
  const user = await User.findOne({ email });

  if (user) {
    return res.status(409).json({"message": "Email in use"})
  }

  try {
    const newUser = new User({email});
    newUser.setPassword(password);
    await newUser.save();
    res.status(200).json({"user": newUser})
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  const {password, email} = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.validPassword(password)) {
    return res.status(401).json({"message": "Incorrect login or password"})
  }
  
  const payload = {
    id: user.id,
    email: user.email,
  }
  
  const token = jwt.sign(payload, "secret", {expiresIn: '24h'}, secret);
  await service.login(user.id, token)

  res.status(200).json({
    "user": user
  })
}

const logout = async (req, res, next) => {
  try {
    await service.logout(req.user.id)
    res.status(204).json({"message": "No Content"})
  } catch(err) {
    throw new Error(err)
  }
}

const current = async (req, res, next) => {
  try {
    const user = req.user;
  
    if (!user) {
      throw new Error("User cannot find!!");
    }
    if (!user.token) {
      throw new Error("Unauthorised!");
    }
    res.status(200).json(req.user)
  } catch (error) {
    next(error)
  }
}

const subs = async (req, res, next) => {
  try {
    const user = req.user;
    const type = req.body.subscription
    await service.promote(user.id, type)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  register,
  login,
  logout,
  current,
  subs
}