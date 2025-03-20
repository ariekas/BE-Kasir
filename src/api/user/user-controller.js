const userService = require('./user-service');

const createUser = async (req, res) => {
    const {username, password, role, phoneNumber} = req.body
    const profilePic = req.file;
    try {
        const user = await userService.createUser({username, password, role, phoneNumber}, profilePic)
        res.status(201).json({message: 'User created', data: user})
    } catch (error) {
        res.status(401).json({message: error.message})
    }
}

const getUser = async (req, res) => {
    try {
        const Datauser = await userService.getUser()
        res.status(201).json({
            message: "User found",
            data: Datauser
        }) 
    } catch (error) {
        
    }
}

const getUserId = async (req, res) => {
    const {userId} = req.params
    try {
        const user = await userService.getUser(userId)
        res.status(201).json({
            message: `user with id ${userId} found`,
            data: user
        })
    } catch (error) {
          res.status(401).json({
            message: error.message
          })  
        }
}

const updateRole = async (req, res) => {
    const {userId} = req.params
    const {role} = req.body
    try {
        const user = await userService.updateRole(userId, role)
        console.log(user)
        res.status(201).json({
            message: "User role updated",
            data: user
        })
    } catch (error) {
        res.status(401).json({
            message: error.message
        })
    }
} 

const deleteUser = async (req, res) => {
    const {userId} = req.params
    try {
        const user = await userService.deleteUser(parseInt(userId))
        res.status(201).json({
            message: "User deleted",
            data: user
        })
    } catch (error) {
        res.status(401).json({
            message: error.message
        })
    }
}

module.exports = {
    createUser,
    updateRole,
    deleteUser,
    getUser,
    getUserId
}