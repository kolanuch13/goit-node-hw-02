const service = require('../service/index');
const User = require('../service/schemas/users');
const secret = process.env.SECRET_KEY;
const jwt = require('jsonwebtoken');
const passport = require('passport');

const get = async (req, res, next) => {
  try {
    const result = await service.getAllContacts();
    res.status(200).json(result)  
  } catch(error) {
    next(error);
  }
}

const getById = async (req, res, next) => {
  const id = req.params;
  try {
    const result = await service.getContactById(id.contactId);
    if(!result) {
      res.status(404).json({"message": "Not found contact with that id."})
    }
    res.status(200).json(result)  
  } catch(error) {
    next(error);
  }
}

const create = async (req, res, next) => {
  const contact = req.body
  try {
    const result = await service.addContact(contact)
    res.status(201).json(result)
  } catch (error) {
    next(error);
  }
}

const remove = async (req, res, next) => {
  const id = req.params;
  try {
    const result = await service.removeContact(id.contactId);
    if(!result) {
      res.status(404).json({"message": "Not found contact with that id."})
    }
    res.status(200).json(result)
  } catch (error) {
    next(error);
  }
}

const update = async (req, res, next) => {
  const id = req.params;
  const info = req.body;
  try {
    if(!Object.keys(info).length) {
      res.status(400).json({"message": "Missing all field."})
    }
    const result = await service.updateContact(id.contactId, info);
    res.status(200).json(result)
  } catch (error) {
    next(error);
  }
}

const updateFav = async (req, res, next) => {
  const id = req.params;
  const info = req.body;
  try {
    if(!Object.keys(info).includes('favorite')) {
      res.status(400).json({"message": "Missing field favorite."})
    }
    const result = await service.updateContact(id.contactId, info);
    res.status(200).json(result)
  } catch (error) {
    next(error);
  }
}

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

  const token = jwt.sign(payload, secret, {expiresIn: '1h'});
  res.status(200).json({
    "token": token, 
    "user": user
  })
}

const auth = (req, res, next) => {
    passport.authenticate('jwt', {session:false}, (error, user) => {
      if(!user||error) {
        res.status(401).json({"message": "Unauthorized"});
      }
      req.user = user;
      next()  
    })(req, res, next)
}

module.exports = {
  get, 
  getById,
  create,
  remove,
  update,
  updateFav,
  register,
  login,
  auth
}