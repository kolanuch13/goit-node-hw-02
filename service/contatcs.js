const Contact = require('./schemas/contacts')

const getAllContacts = async (ownerId, page, limit) => {
  return Contact.find({owner: ownerId}).skip(page*limit).limit(limit).exec();
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

module.exports = {
  getAllContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  toggleFavorite
}