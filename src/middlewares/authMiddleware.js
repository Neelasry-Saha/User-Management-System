const jwt = require("jsonwebtoken");
const config = require("../config");
const ApiError = require("../utils/ApiError");
const userModel = require("../models/userModel");
const asyncHandler = require("./asyncHandler");

// Verifies the Bearer token and attaches the user to req.user
const protect = asyncHandler(async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    }

    if (!token) {
        throw new ApiError(401, "Not authorized, no token provided");
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        const user = await userModel.findById(decoded.id);

        if (!user) {
            throw new ApiError(401, "Not authorized, user not found");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, "Not authorized, token invalid or expired");
    }
});

// Restricts access to admin users only (use after `protect`)
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        return next();
    }
    throw new ApiError(403, "Access denied, admin privileges required");
};

module.exports = { protect, isAdmin };
