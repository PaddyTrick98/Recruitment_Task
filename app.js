require('dotenv').config()
const express = require('express')
const { sequelize } = require('./models')

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Import Routes
const usersRoute = require('./routes/users.route')
const postsRoute = require('./routes/posts.route')
//===================================================================



// Login & Register
app.use('/', usersRoute)

// Add new post, Show post, Show all posts, Update post, Delete post
app.use('/posts', postsRoute)




//==============================================================================
app.listen({ port: 5000 }, async () => {
  console.log('Server up on http://localhost:5000')
  await sequelize.authenticate()
  console.log('Database Connected!')
})
