const prisma = require('../../config/db')

const userByUsername = async (username) => {
    return await prisma.user.findUnique({where:{username}})
}

module.exports = {
    userByUsername
}