const prisma = require('../../config/db')
const authService = require('./auth-service')
const bcrypt = require('bcryptjs');


const login = async (req, res) => {
    const {username, password} = req.body
    try {
       const user = await authService.login(username, password)
       res.status(201).json({
        message: "Login success",
        data: user
       }) 
    } catch (error) {
        res.status(401).json({message: error.message})
    }
}

module.exports = {
    login
}