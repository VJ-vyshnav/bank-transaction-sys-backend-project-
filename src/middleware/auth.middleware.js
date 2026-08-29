const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");



async function authMiddleware(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];//check for token in cookies or authorization header

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized: No token provided",
            status: "failed",
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);//<---user id is stored in decoded
        const user = await userModel.findById(decoded.userId);
        req.user = user; // Attach the user object to the request for further use
        return next();
    }catch (error) {
        return res.status(401).json({
            message: "Unauthorized: Invalid token",
            status: "failed",
        });
    } 
}
module.exports = {
    authMiddleware,
}