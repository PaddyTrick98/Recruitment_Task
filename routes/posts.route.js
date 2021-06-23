const express = require('express')
const router = express.Router()
const { body } = require('express-validator')

 // Import Controllers
const posts = require('../controllers/post.controller')

// Import Middleware
const { authenticate } = require('../middlewares/authenticate')
//===================================================================

const postValidator = [
    body('title')
    .trim()
    .isLength(5)
    .withMessage('Title length too short, minimum 5 characters requried'),

    body('lead')
    .trim()
    .isLength(5)
    .withMessage('Title length too short, minimum 5 characters requried'),

    body('content')
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('The length of the content should be 5 to 500 characters')
]

// Add new post
// http://localhost:5000/posts
router.post('/', authenticate, postValidator, posts.create)

// Show all posts 
// http://localhost:5000/posts
router.get('/', posts.showAll)

// Find post
// http://localhost:5000/posts/ { uuid }
router.get('/:uuid', posts.find)

// Edit post
// http://localhost:5000/posts/ { uuid }
router.put('/:uuid', authenticate, postValidator, posts.update)

// Delete post
// http://localhost:5000/posts/ { uuid }
router.delete('/:uuid', authenticate, posts.delete)

module.exports = router