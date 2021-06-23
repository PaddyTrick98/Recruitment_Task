const express = require('express')
const router = express.Router()
const { body } = require('express-validator')

 // Import Controllers
const users = require('../controllers/user.controller')
//===================================================================

const userValidator = [
    body('name')
    .notEmpty()
    .withMessage('name is required')
    .trim()
    .isLength(3)
    .withMessage('Name length too short, minimum 3 characters required'),

    body('email')
    .notEmpty()
    .withMessage('email is required')
    .trim()
    .isEmail()
    .withMessage('Email must be a valid email')
    .normalizeEmail()
    .toLowerCase(),

    body('password')
    .notEmpty()
    .withMessage('password is required')
    .trim()
    .isLength(5)
    .withMessage('Password length too short, minimum 5 characters required'),
]

// Register
router.post('/register', userValidator, users.register)

// Login
router.post('/login', users.login)




module.exports = router
