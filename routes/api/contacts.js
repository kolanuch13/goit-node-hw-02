const express = require('express');
const contacts = require('../../models/contacts');
const { nanoid } = require('nanoid');

const router = express.Router()

router.get('/', async (req, res, next) => {
  const result = await contacts.listContacts();
  console.table(result);
  res.json(result)  
})

router.get('/:contactId', async (req, res, next) => {
  const id = req.params.contactId;
  const result = await contacts.getContactById(id);
  console.log(result);
  if(!result) {
    res.status(404).json({
      "status": "Error",
      "code": "404",
      "message": "Not found"
    });
  } else {
    res.status(201).json({
      "status": "success",
      "code": "201",
      result
    });
  }
})

router.delete('/:contactId', async (req, res, next) => {
    const id = req.params.contactId;
    const myContact = await contacts.getContactById(id)
    console.log(myContact);
    if (!myContact) {
      res.json({
        "status": "Error",
        "code": "404",
        "message": "Not found"
      });
    } else {
      await contacts.removeContact(id);
      res.json({
        "status": "success",
        "code": "200",
        "message": "contact deleted"
      });
    }
})

router.post('/', async (req, res, next) => {
  const {name, email, phone} = req.body;
  if (name && email && phone) {
    const newContact = {
      id: nanoid(),
      name: name,
      email: email,
      phone: phone,
    }
    await contacts.addContact(newContact)
    res.json({
      "status": "success",
      "code": "200",
      newContact
    })
  } else {
    res.json({
      "status": "Error",
      "code": "400",
      "message": "missing required name field"
    })
  }
})

router.put('/:contactId', async (req, res, next) => {
  const id = req.params.contactId;
  const myContact = await contacts.getContactById(id);
  const {name, email, phone} = req.body;
  console.log(myContact.email);
  const newContact = {
    id: myContact.id,
    name: name ? name : myContact.name,
    email: email ? email : myContact.email,
    phone: phone ? phone : myContact.phone,
  }
  await contacts.removeContact(id);
  await contacts.addContact(newContact)

  res.json({
    "status": "success",
    "code": "200",
    newContact
  })
})

module.exports = router
