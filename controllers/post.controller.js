const { User ,Post } = require('../models')
const { validationResult } = require('express-validator')



// Add Post
// in userUuid write your user uuid
exports.create = async (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        console.log(errors)
        return res.status(400).send(errors)
    }

    const { userUuid, title, lead, content } = req.body

  try {
    const user = await User.findOne({ where: { uuid: userUuid } })

    const post = await Post.create({ title, lead, content, author: user.uuid })

    return res.json( { success: 1, post: post })
  } catch (err) {
    console.log(err)
    return res.status(500).send("Internal Server Error")
  }
}


// Show all posts
exports.showAll = async (req, res) => {

    try {
        const posts = await Post.findAll({ include: [{ model: User, as: 'post author' }] })
        
        // const users = await User.findOne()
    
        return res.json({ success: 1, posts: posts })
      } catch (err) {
        console.log(err)
        return res.status(500).send("Internal Server Error")
      }
}


// Find post
exports.find = async (req, res) => {

    const uuid = req.params.uuid
    
    try {
        const post = await Post.findOne({ where: { uuid } })
        return res.json(post)
    } catch (err) {
        console.log(err)
        return res.status(500).send("Internal Server Error")
    }
}


// Update post
exports.update = async (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        console.log(errors)
        return res.json({ message: errors })
    }

    const uuid = req.params.uuid
    
    const { userUuid, title, lead, content} = req.body

    try {
        const post = await Post.findOne({ where: { uuid } })
        
        

        post.title = title
        post.lead = lead
        post.content = content

        if ( post.author !== userUuid ) {
            return res.status(403).send("You cannot edit this post because you are not the author")
        }
        
        await post.save()
        
        return res.json({ message: 'Post updated!' })
    } catch (err) {
        console.log(err)
        return res.status(500).send("Internal Server Error")
    }
}


// Delete post
exports.delete = async (req, res) => {

    const uuid = req.params.uuid
    const { userUuid } = req.body

    try {
        const post = await Post.findOne({ where: { uuid } })
        
        if ( post.author !== userUuid ) {
            return res.status(403).send("You cannot delete this post because you are not the author")
        }


        await post.destroy()
        
        return res.json({ message: 'Post deleted!' })
    } catch (err) {
        console.log(err)
        return res.status(500).send("Internal Server Error")
    }

}