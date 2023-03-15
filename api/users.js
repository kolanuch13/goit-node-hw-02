const express = require('express');
const router = express.Router();
const ctrlContacts = require('../controller/users');
const check = require('../middleware/checkAuthLogin');
const upload = require('../middleware/avatar');

router.post('/register', ctrlContacts.register);

router.post('/login', ctrlContacts.login);

router.post('/logout', check.auth, ctrlContacts.logout);

router.post('/current', check.auth, ctrlContacts.current);

router.patch('/', check.auth, ctrlContacts.subs);

// ==========================

router.post('/avatar', check.auth, upload.single('picture'), ctrlContacts.avatar);

module.exports = router