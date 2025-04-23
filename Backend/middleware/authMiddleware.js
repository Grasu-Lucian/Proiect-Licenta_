const jwt = require('jsonwebtoken');
//with bearer token

const authMiddleware = (req, res, next) => {
    

    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    // Verify the token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

const authMiddlewareTeacher = (req, res, next) => {
    

    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    // Verify the token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_TEACHER);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};      

module.exports = {authMiddleware, authMiddlewareTeacher};