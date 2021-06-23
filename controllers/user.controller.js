require('dotenv').config()
const { User } = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')


// Register
exports.register = async (req, res) => {

    const { name, email, password } = req.body
    
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        console.log(errors)
        return res.status(400).send(errors)
    }

    try {
        
        const hashedPassword = await bcrypt.hash(password, 10)
        
        const user = await User.create({ name, email, password: hashedPassword })

        return res.json({ message: "Registration was successful", user })
        
    } catch (err) {
        
        console.log(err)
        return res.status(500).send("Something went wrong..")
        
    }
}


// Login
exports.login = async (req, res) => {

    const { email } = req.body
    
    const userWithEmail = await User.findOne({ where: { email } })

    console.log("KONSOLA", userWithEmail)


    try {
        
        if (!userWithEmail) {
            return res.status(401).send("Email or password does not match")
        }
        
        if (await !bcrypt.compare(req.body.password, userWithEmail.password)) {
            return res.status(401).send("Email or password does not match")
        }
        
        const accessToken = jwt.sign({ uuid: userWithEmail.uuid, email: userWithEmail.email }, process.env.TOKEN_SECRET)
        
        res.json({
            success: 1, message: "Logged in!", token: accessToken
        })
    } catch (err) {
        console.log(err)
        res.status(500).send("Something went wrong...")
    }
}