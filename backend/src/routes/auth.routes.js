const express = require('express');
const router = express.Router();
const path = require('path');

const AuthController = require(path.join(__dirname, '..', 'modules', 'auth', 'auth.controller'));

// POST /api/auth/login
router.post('/login', AuthController.login);

// POST /api/auth/verify
router.post('/verify', AuthController.verify);

module.exports = router;
