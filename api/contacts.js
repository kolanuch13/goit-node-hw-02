const express = require('express');
const router = express.Router()
const ctrlContacts = require('../controller/contatcs')
const check = require('../middleware/checkAuthLogin')

router.get('/', check.auth, ctrlContacts.get);

router.get('/:contactId', check.auth, ctrlContacts.getById);

router.post('/', check.auth, ctrlContacts.create);

router.delete('/:contactId', check.auth, ctrlContacts.remove);

router.put('/:contactId', check.auth, ctrlContacts.update);

router.patch('/:contactId/favorite', check.auth, ctrlContacts.updateFav);

module.exports = router