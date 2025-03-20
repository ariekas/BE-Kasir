const authResponsitory = require('./auth-responsitory')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.SECRET_KEY;

require('dotenv').config();

const login = async (username, password) => {
    const user = await authResponsitory.userByUsername(username)
    if (!user) throw new Error('User not found');

    const verifPassword = await bcrypt.compare(password, user.password)
    if (!verifPassword) throw new Error('Invalid password')

        const token = jwt.sign(
            {id: user.id, username: user.username, role: user.role},
            SECRET_KEY,
            {expiresIn: '1d'}
        )
    return {  id: user.id, 
        username: user.username, 
        role: user.role, 
        token: token  }
}

module.exports = {
    login   
}