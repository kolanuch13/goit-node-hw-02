const express = require('express');
const router = express.Router()
const ctrlContacts = require('../controller')
const {checkUserLogin} = require('../middleware/checkAuthLogin');

router.get('/', ctrlContacts.get);

router.get('/:contactId', ctrlContacts.getById);

router.post('/', ctrlContacts.create);

router.delete('/:contactId', ctrlContacts.remove);

router.put('/:contactId', ctrlContacts.update);

router.patch('/:contactId/favorite', ctrlContacts.updateFav);

// ==========================================================

router.post('/users/register', ctrlContacts.register);

router.post('/users/login', ctrlContacts.login);

router.post('/users/logout', ctrlContacts.logout);

router.post('/users/check', checkUserLogin, async (req, res) => {
  res.status(200).send({success: 'success add root config'})
});

router.post('/users/current', ctrlContacts.current);

module.exports = router