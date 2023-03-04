// const { error } = require('console');
const fs = require('fs/promises');
const path = require('path');

const contactPath = path.join(__dirname, './contacts.json');

const listContacts = async () => {
  const result = await fs.readFile(contactPath, 'utf-8');
  return JSON.parse(result)
}

const getContactById = async (contactId) => {
  const data = await listContacts();
  const result = data.filter(contact => contact.id === contactId);
  return result[0];
}

const removeContact = async (contactId) => {
  const data = await listContacts();
  const result = data.filter(contact => contact.id !== contactId);
  await fs.writeFile(contactPath, JSON.stringify(result, null, 2));
  return result;
}

const addContact = async (newContact) => {
  const contacts = await listContacts();
  contacts.push(newContact);
  await fs.writeFile(contactPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

const updateContact = async (contactId, updContact) => {
  const myContact = await getContactById(contactId);
  const newContact = {
    id: myContact.id,
    name: updContact.name ? updContact.name : myContact.name,
    email: updContact.email ? updContact.email : myContact.email,
    phone: updContact.phone ? updContact.phone : myContact.phone,
  }
  await removeContact(contactId);
  await addContact(newContact);
  return newContact;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
