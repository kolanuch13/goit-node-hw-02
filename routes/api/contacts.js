const express = require('express');
const contacts = require('../../models/contacts');
const { nanoid } = require('nanoid');
const Joi = require('joi')

const newContactSchema = Joi.object({
  id: Joi.string(),
  
  name: Joi.string()
    .pattern(new RegExp('^[a-zA-Z]+ [a-zA-Z]+$'))
    .required(),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required(),
  
  phone: Joi.string()
    .pattern(new RegExp('^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$'))
    .required(),
})

const newInfoSchema = Joi.object({
  name: Joi.string()
    .pattern(new RegExp('^[a-zA-Z]+ [a-zA-Z]+$')),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  
  phone: Joi.string()
    .pattern(new RegExp('^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$')),
}).nand("name", "email", "phone")

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const result = await contacts.listContacts();
    res.json(result)  
  } catch(error) {
    next(error);
  }
})

router.get('/:contactId', async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const result = await contacts.getContactById(id);
    if(!result) {
      res.status(404).json({"message": "Not found contact with that it."})
    }
    res.status(200).json({
      "message": "Success",
      result
    });
  } catch(error) {
    next(error);
  }
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const myContact = await contacts.getContactById(id)
    if (!myContact) {
      res.status(404).json({"message": "Not found contact with that it."});
    } else {
      await contacts.removeContact(id);
      res.json({
        "status": "success",
        "code": "200",
        "message": "contact deleted"
      });
    }
  } catch(error) {
    next(error);
  }
})

router.post('/', async (req, res, next) => {
  try {
    const isValid = newContactSchema.validate({
      id: nanoid(),
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    })
    if (isValid.error) {
      res.status(400).json({"message": "Missing required field."})
    }
    const newContact = isValid.value;
    await contacts.addContact(newContact)
    res.json({
      "status": "success",
      "code": "200",
      newContact
    })
  } catch (error) {
    next(error);
  }
})

router.put('/:contactId', async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const isValid = newInfoSchema.validate({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    })
    const updContact = isValid.value;
    if (!isValid.error) {
      const newContact = await contacts.updateContact(id, updContact)
      res.json({
        "status": "success",
        "code": "200",
        newContact
      })
    } else {
      res.status(400).json({"message": "Missing all field."})
    }
  } catch(error) {
    next(error);
  }
})

module.exports = router
