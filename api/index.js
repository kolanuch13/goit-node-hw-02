const express = require('express');
const router = express.Router()
const ctrlContacts = require('../controller')

router.get('/', ctrlContacts.get);

router.get('/:contactId', ctrlContacts.getById);

router.post('/', ctrlContacts.create);

router.delete('/:contactId', ctrlContacts.remove);

router.put('/:contactId', ctrlContacts.update);

router.patch('/:contactId/favorite', ctrlContacts.updateFav);

// ==========================================================

router.post('/users/register', ctrlContacts.register);

router.post('/users/login', ctrlContacts.login);

router.get('/users/list', ctrlContacts.auth, (req, res, next) => {
  const {userEmail} = req.email;
  res.status(200).json({"message": `Authorization was successful: ${userEmail}`})
});


module.exports = router