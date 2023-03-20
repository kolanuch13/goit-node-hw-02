const service = require('../service/users');
const User = require('../service/schemas/users');
const secret = process.env.SECRET_KEY;
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const Jimp = require('jimp');
const { nanoid } = require('nanoid');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SG_TOKEN);


// const path = require('path');

const register = async (req, res, next) => {
  const {password, email} = req.body;
  const user = await User.findOne({ email });

  if (user) {
    return res.status(409).json({"message": "Email in use"})
  }

  try {
    const newUser = new User({email});
    const avatar = gravatar.url(email);
    const verificationToken = nanoid()
    newUser.setAvatar(avatar);
    newUser.setPassword(password);
    newUser.setVerificationToken(verificationToken);
    await newUser.save();
    // ===
    const msg = {
      to: email, 
      from: 'cyberwarrior777@ukr.net',
      subject: 'Verification',
      text: `Wats up man? It's galaxy community! You have to go for this link to verify in our team http://localhost:3000/users/verify/:verificationToken`,
      html: `<strong><a href="http://localhost:3000/api/users/verify/${user.verificationToken}">Click me!</a></strong>`,
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })
    // ===
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

  if (!user.verify) {
    return res.status(404).json({"message": 'At first you need to verify your account!'})
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

const avatar = async (req, res, next) => {
  const user = req.user;
  try {
    Jimp.read(`./tmp/${req.file.filename}`, (err, avatar) => {
      if (err) throw err;
      avatar.resize(250, 250).write(`./public/avatars/${user.email}.jpg`);
    });
    await service.avatar(user.id ,`http://localhost:3000/static/avatars/${user.email}.jpg`)
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}
  
// ========================================

const verify = async (req, res, next) => {
  const verificationToken = req.params.verificationToken;
  console.log(verificationToken);
  try {
    await service.verify(verificationToken)
    res.status(200).json({"message": 'Verification successful'})
  } catch(error) {
    res.status(404).json({"message": 'User not found', details: error})
  }
}

const reVerify = async (req, res, next) => {
  const email = req.body.email;
  const user = req.user;
  if (!email) {
    res.status(400).json({"message": "Missing required field email."})
  }
  try {
    if(user.verify) {
      res.status(400).json({"message": "Verification has already been passed."})
    }
    const msg = {
      to: email, 
      from: 'cyberwarrior777@ukr.net',
      subject: 'Verification',
      text: `Wats up man? It's galaxy community! You have to go for this link to verify in our team http://localhost:3000/users/verify/:${user.verificationToken}`,
      html: `<strong><a href="http://localhost:3000/api/users/verify/${user.verificationToken}">Click me!</a></strong>`,
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })
      res.status(200).json({"message": "Verification email sent."})
  } catch(error) {
    res.status(404).json({"message": 'User not found.', details: error})
  }
}

module.exports = {
  register,
  login,
  logout,
  current,
  subs,
  avatar,
  verify,
  reVerify
}