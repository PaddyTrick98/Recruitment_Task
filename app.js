require('dotenv').config()
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { sequelize, User, Post } = require('./models')
const user = require("./models/user");

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//===================================================================


// Register
app.post('/register', async (req, res) => {
    
    const { name, email, password } = req.body
    
    try {
        
        const hashedPassword = await bcrypt.hash(password, 10)
        
        const user = await User.create({ name, email, password: hashedPassword })
        return res.json({ message: "Registration was successful", user })
        
    } catch (err) {
        
        console.log(err)
        return res.status(400).json({ success: 0, error: err })
        
    }
    
})


// Login 
app.post('/login', async (req, res) => {
    
    const { email } = req.body
    
    const userWithEmail = await User.findOne({ where: { email } })
    
    try {
        
        if (!userWithEmail) {
            return res.json({
                success: 0, message: "Email or password does not match"
            })
        }
        
        
        if (await !bcrypt.compare(req.body.password, userWithEmail.password)) {
            return res.json({
                success: 0, message: "Email or password does not match"
            })
        }
        
        const accessToken = jwt.sign({ uuid: userWithEmail.uuid, email: userWithEmail.email }, process.env.TOKEN_SECRET)
        
        res.json({
            success: 1, message: "Logged in!", token: accessToken
        })
    } catch (err) {
        res.status(500).json({ status: 0, error: err })
    }
    
})


//AUTHORIZATION
function authenticate(req, res , next) {
    
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    if (token === null) {
        return res.sendStatus(401)
    }
    
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403)
        }
        
        req.user = user
        next()
    })
    
}

//==============================================================================


// CREATE POST - http://localhost:5000/posts
// in userUuid write your user uuid
app.post('/posts', async (req, res) => {
  const { userUuid, title, lead, content } = req.body

  try {
    const user = await User.findOne({ where: { uuid: userUuid } })

    const post = await Post.create({ title, lead, content, author: user.uuid })

    return res.json( { success: 1, post: post })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ success: 0, error: err })
  }
})



//  READ ALL POSTS - http://localhost:5000/posts
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.findAll({ include: [{ model: User, as: 'post author' }] })
    
    // const users = await User.findOne()

    return res.json({ success: 1, posts: posts })
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
})



//  FIND POST - http://localhost:5000/posts/ { uuid }
app.get('/posts/:uuid', async (req, res) => {
  
    const uuid = req.params.uuid
    
    try {
        const post = await Post.findOne({ where: { uuid } })
        return res.json(post)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Somethin went wrong...' })
    }
})



// UPDATE POST http://localhost:5000/posts/ { uuid }
app.put('/posts/:uuid', authenticate, async (req, res) => {
    
    const uuid = req.params.uuid
    
    
    const { title, lead, content} = req.body
    
    try {
        const post = await Post.findOne({ where: { uuid } })
        
        post.title = title
        post.lead = lead
        post.content = content
        
        await post.save()
        
        return res.json({ message: 'Post updated!' })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong...' })
    }
    
})



// DELETE POST - http://localhost:5000/posts/ { uuid }
app.delete('/posts/:uuid', authenticate, async (req, res) => {
    
    const uuid = req.params.uuid
    
    try {
        const post = await Post.findOne({ where: { uuid } })
        
        await post.destroy()
        
        return res.json({ message: 'Post deleted!' })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong...' })
    }
    
})



//==============================================================================
app.listen({ port: 5000 }, async () => {
  console.log('Server up on http://localhost:5000')
  await sequelize.authenticate()
  console.log('Database Connected!')
})
