const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(403).json({ message: 'No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'Invalid token format.' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token.' });
        }

        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

const verifyRole = (requiredRole) => {
    return (req, res, next) => {
        const userRole = req.userRole;

        if (userRole !== requiredRole) {
            return res.status(403).json({ message: 'You do not have the required role.' });
        }

        next();
    };
};


module.exports = {
    verifyRole,
    verifyToken
}