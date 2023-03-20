const User = require('./schemas/users')

const registration = async ({password, email}) => {
  return User.create({password, email});
}

const login = (id, token) => {
  return User.findByIdAndUpdate({_id: id}, {token: token});
}

const logout = (id) => {
  return User.findByIdAndUpdate({_id: id}, {token: ""});
}

const promote = (id, type) => {
  return User.findByIdAndUpdate({_id: id}, {subscription: type})
}

const avatar = (id, avatar) => {
  return User.findByIdAndUpdate({_id: id}, {avatarURL: avatar})
}

const verify = (token) => {
  return User.findOneAndUpdate({verificationToken: token}, {verify: true})
}

module.exports = {
  registration,
  login,
  logout,
  promote,
  avatar,
  verify
}