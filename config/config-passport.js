const passport = require('passport')
const passportJWT = require('passport-jwt')
const User = require('../service/schemas/users')
require('dotenv').config()
const secret = process.env.SECRET_KEY;

const ExtractJWT = passportJWT.ExtractJwt
const Strategy = passportJWT.Strategy
const params = {
  secretOrKey: secret,
  jwtRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
}

passport.use(
  new Strategy(params, (payload, done) => {
    User.find({_id: payload.id})
      .then(([user]) => {
        if(!user) {
          return done(new Error('User not found'))
        }
        return done(null, user)
      })
      .catch((err) => done(err))
  })
)