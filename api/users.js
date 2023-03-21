const express = require('express');
const router = express.Router();
const ctrlUsers = require('../controller/users');
const check = require('../middleware/checkAuthLogin');
const upload = require('../middleware/avatar');

router.post('/register', ctrlUsers.register);

router.post('/login', check.verify, ctrlUsers.login);

router.post('/logout', check.auth, ctrlUsers.logout);

router.post('/current', check.auth, ctrlUsers.current);

router.patch('/', check.auth, ctrlUsers.subs);

router.post('/avatar', check.auth, upload.single('picture'), ctrlUsers.avatar);

router.get('/verify/:verificationToken', ctrlUsers.verify)

router.post('/verify', check.auth, ctrlUsers.reVerify)

module.exports = router