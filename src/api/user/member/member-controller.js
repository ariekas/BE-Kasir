const memberService = require("./member-service")

const createMember = async (req, res) => {
    const memberData = req.body
    try {
        const create = await memberService.createMember(memberData)
        res.status(201).json({
            message: "Member created",
            status: 200,
            data: create
        })
    } catch (error) {
        res.status(401).json({
            message: error.message
        })
    }
}

const getMembers = async (req, res) => {
    try {
        const getAll = await memberService.getMembers();
        res.status(200).json({
            message: "Members fetched",
            status: 200,
            data: getAll
        });
    } catch (error) {
        res.status(401).json({message: error.message})
    }
}

module.exports = {
    createMember,
    getMembers
}