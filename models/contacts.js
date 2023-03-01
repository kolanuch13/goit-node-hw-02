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

const updateContact = async (contactId, newContact) => {
  const data = await listContacts();
  let myContact = await data.filter(contact => contact.id === contactId)[0];
  myContact = {
    id: this.id,
    name: newContact.name ? newContact.name : this.name,
    email: newContact.email ? newContact.email : this.email,
    phone: newContact.phone ? newContact.phone : this.phone,
  }
  await removeContact(myContact.id)
  data.push(myContact);
  console.log(data);
  await fs.writeFile(contactPath, JSON.stringify(data, null, 2));
  return newContact;
  // const data = await listContacts();
  // const result = data.filter(contact => contact.id === contactId)[0];
  // const newInfo = {
  //   name: body.name ? result.name = body.name : body.name,
  //   email: body.email ? result.email = body.email : body.email,
  //   phone: body.phone ? result.phone = body.phone : body.phone,
  // }
  // console.log(newInfo);
  // await fs.writeFile(contactPath, JSON.stringify(newInfo, null, 2));
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
