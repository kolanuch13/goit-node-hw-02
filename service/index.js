const Contact = require('./schemas/contacts')
const User = require('./schemas/users')

const getAllContacts = async (ownerId) => {
  return Contact.find({owner: ownerId}).exec();
}

const getContactById = (id, ownerId) => {
  return Contact.findOne({ _id: id, owner: ownerId});
}

const addContact = ({name, email, phone, favorite, owner}) => {
  return Contact.create({name, email, phone, favorite, owner});
}

const removeContact = (id) => {
  return Contact.findByIdAndRemove({ _id: id });
}

const updateContact = (id, info) => {
  return Contact.findByIdAndUpdate({_id: id}, info);
}

const toggleFavorite = (id, fav) => {
  return Contact.findByIdAndUpdate({_id: id}, fav);
}

const registration = async ({password, email}) => {
  return User.create({password, email});
}

const login = (id, token) => {
  return User.findByIdAndUpdate({_id: id}, {token: token});
}

const logout = (id) => {
  return User.findByIdAndUpdate({_id: id}, {token: ""});
}

module.exports = {
  getAllContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  toggleFavorite,
  registration,
  login,
  logout
}