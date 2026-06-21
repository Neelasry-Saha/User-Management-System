const crypto = require("crypto");
const userModel = require("../models/userModel");
const ApiError = require("../utils/ApiError");
const generateToken = require("../utils/generateToken");

// Create
exports.createUser = async ({ name, email, password }) => {
    const existing = await userModel.findByEmail(email);
    if (existing) throw new ApiError(409, "Email already registered");
    return userModel.create({ name, email, password });
};

// Read (single, generic fetch — kept simple per original spec)
exports.readUser = async () => {
    const all = await userModel.findAll();
    return all.slice(0, 1);
};

// Update (generic update by email, per original spec)
exports.updateUser = async (email, updates) => {
    const user = await userModel.updateByEmail(email, updates);
    if (!user) throw new ApiError(404, "User not found");
    return user;
};

// Delete (generic delete by email, per original spec)
exports.deleteUser = async (email) => {
    const user = await userModel.deleteByEmail(email);
    if (!user) throw new ApiError(404, "User not found");
    return user;
};

// Get All Users
exports.getAllUsers = async () => userModel.findAll();

// Get User by ID
exports.getUserById = async (id) => {
    const user = await userModel.findById(id);
    if (!user) throw new ApiError(404, "User not found");
    return user;
};

// Login
exports.loginUser = async (email, password) => {
    const rawUser = await userModel.findRawByEmail(email);
    if (!rawUser) throw new ApiError(401, "Invalid email or password");
    if (rawUser.isBlocked) throw new ApiError(403, "This account has been blocked");

    const isMatch = await userModel.comparePassword(rawUser, password);
    if (!isMatch) throw new ApiError(401, "Invalid email or password");

    const token = generateToken(rawUser._id);
    const { password: _pw, verificationToken: _vt, ...user } = rawUser;
    return { user, token };
};

// Logout (stateless JWT — handled client-side by discarding the token)
exports.logoutUser = async () => true;

// Change Password
exports.changePassword = async (userId, oldPassword, newPassword) => {
    const rawUser = await userModel.findRawById(userId);
    if (!rawUser) throw new ApiError(404, "User not found");

    const isMatch = await userModel.comparePassword(rawUser, oldPassword);
    if (!isMatch) throw new ApiError(401, "Old password is incorrect");

    return userModel.updatePassword(userId, newPassword);
};

// Update Profile
exports.updateProfile = async (userId, updates) => {
    const allowed = ["name", "profilePicture"];
    const filtered = {};
    allowed.forEach((key) => {
        if (updates[key] !== undefined) filtered[key] = updates[key];
    });

    const user = await userModel.updateById(userId, filtered);
    if (!user) throw new ApiError(404, "User not found");
    return user;
};

// Make Admin
exports.makeAdmin = async (id) => {
    const user = await userModel.updateById(id, { role: "admin" });
    if (!user) throw new ApiError(404, "User not found");
    return user;
};

// Remove Admin
exports.removeAdmin = async (id) => {
    const user = await userModel.updateById(id, { role: "user" });
    if (!user) throw new ApiError(404, "User not found");
    return user;
};

// Search Users (by name or email, partial match)
exports.searchUsers = async (query) => userModel.search(query);

// Filter Users (by role and/or blocked status)
exports.filterUsers = async (filters) => userModel.filter(filters);

// Block User
exports.blockUser = async (id) => {
    const user = await userModel.updateById(id, { isBlocked: true });
    if (!user) throw new ApiError(404, "User not found");
    return user;
};

// Unblock User
exports.unblockUser = async (id) => {
    const user = await userModel.updateById(id, { isBlocked: false });
    if (!user) throw new ApiError(404, "User not found");
    return user;
};

// Verify Email
exports.verifyEmail = async (token) => {
    const rawUser = await userModel.findByVerificationToken(token);
    if (!rawUser) throw new ApiError(400, "Invalid or expired verification token");

    return userModel.updateById(rawUser._id, {
        isVerified: true,
        verificationToken: null,
    });
};

// Resend Verification
exports.resendVerification = async (email) => {
    const rawUser = await userModel.findRawByEmail(email);
    if (!rawUser) throw new ApiError(404, "User not found");
    if (rawUser.isVerified) throw new ApiError(400, "Email is already verified");

    const newToken = crypto.randomBytes(20).toString("hex");
    return userModel.updateById(rawUser._id, { verificationToken: newToken });
};

// Upload Profile Picture
exports.uploadProfilePicture = async (userId, filePath) => {
    const user = await userModel.updateById(userId, { profilePicture: filePath });
    if (!user) throw new ApiError(404, "User not found");
    return user;
};

// Delete Account
exports.deleteAccount = async (userId) => {
    const user = await userModel.deleteById(userId);
    if (!user) throw new ApiError(404, "User not found");
    return user;
};
