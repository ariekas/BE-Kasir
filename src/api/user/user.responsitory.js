const userRepository = require('./user-responsitory');
const bcrypt = require('bcryptjs');

const getUser = async () => {
    return await userRepository.findAll()
}

const getUserId = async (userId) => {
    return await userRepository.findById(userId)
}

const createUser = async (userData, profilePic) => {
    const hashPassword = await bcrypt.hash(userData.password, 10)

    const profilePicPath = profilePic ? profilePic.path : null;

    return await userRepository.create({
        ...userData,
        password: hashPassword,
        profilePic: profilePicPath
    })
}

const updateRole = async (userId, role) => {
    return await userRepository.update(userId, role)
}

const deleteUser = async (userId) => {
    return await userRepository.disable(userId)
}



module.exports = {
    createUser,
    updateRole,
    deleteUser,
    getUser,
    getUserId
}