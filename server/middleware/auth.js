import jwt from "jsonwebtoken";

/**
 * Middleware function that verifies the authentication token in the request header.
 * 
 * If the token is valid, it extracts the user ID from the token and adds it to the request object.
 * If the token is invalid or missing, it returns a 401 Unauthorized response.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the stack.
 */
const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.userId };
        next();
    } catch (error) {
        res.status(401).json({ error: 'Authentication failed' });
    }
};

export default auth;