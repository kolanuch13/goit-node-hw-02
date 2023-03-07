const Contact = require('./schemas/contacts')

const getAllContacts = async () => {
  return Contact.find();
}

const getContactById = (id) => {
  return Contact.findOne({ _id: id});
}

const addContact = ({name, email, phone, favorite}) => {
  return Contact.create({name, email, phone, favorite});
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

module.exports = {
  getAllContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  toggleFavorite
}