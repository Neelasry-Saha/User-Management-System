const asyncHandler = require("../middlewares/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const userService = require("../services/userService");

// Create User
exports.createUser = asyncHandler(async (req, res) => {
    const user = await userService.createUser(req.body);
    res.status(201).json(new ApiResponse(201, "User created successfully", user));
});

// Read User
exports.readUser = asyncHandler(async (req, res) => {
    const user = await userService.readUser();
    res.status(200).json(new ApiResponse(200, "User read successfully", user));
});

// Update User
exports.updateUser = asyncHandler(async (req, res) => {
    const { email, ...updates } = req.body;
    const user = await userService.updateUser(email, updates);
    res.status(200).json(new ApiResponse(200, "User updated successfully", user));
});

// Delete User
exports.deleteUser = asyncHandler(async (req, res) => {
    const { email } = req.body;
    await userService.deleteUser(email);
    res.status(200).json(new ApiResponse(200, "User deleted successfully"));
});

// Get All Users
exports.getAllUsers = asyncHandler(async (req, res) => {
    const users = await userService.getAllUsers();
    res.status(200).json(new ApiResponse(200, "All users fetched successfully", users));
});

// Get User by ID
exports.getUserById = asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json(new ApiResponse(200, "User fetched by ID", user));
});

// User Login
exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { user, token } = await userService.loginUser(email, password);
    res.status(200).json(
        new ApiResponse(200, "User login successful", { user, token })
    );
});

// User Logout
exports.logoutUser = asyncHandler(async (req, res) => {
    await userService.logoutUser();
    res.status(200).json(new ApiResponse(200, "User logout successful"));
});

// Change Password
exports.changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    await userService.changePassword(req.user._id, oldPassword, newPassword);
    res.status(200).json(new ApiResponse(200, "Password changed successfully"));
});

// Update Profile
exports.updateProfile = asyncHandler(async (req, res) => {
    const user = await userService.updateProfile(req.user._id, req.body);
    res.status(200).json(
        new ApiResponse(200, "User profile updated successfully", user)
    );
});

// Make Admin
exports.makeAdmin = asyncHandler(async (req, res) => {
    const user = await userService.makeAdmin(req.params.id);
    res.status(200).json(
        new ApiResponse(200, "User made admin successfully", user)
    );
});

// Remove Admin
exports.removeAdmin = asyncHandler(async (req, res) => {
    const user = await userService.removeAdmin(req.params.id);
    res.status(200).json(
        new ApiResponse(200, "Admin role removed successfully", user)
    );
});

// Search Users
exports.searchUsers = asyncHandler(async (req, res) => {
    const users = await userService.searchUsers(req.query.q);
    res.status(200).json(
        new ApiResponse(200, "User search completed successfully", users)
    );
});

// Filter Users
exports.filterUsers = asyncHandler(async (req, res) => {
    const users = await userService.filterUsers(req.query);
    res.status(200).json(
        new ApiResponse(200, "User filter completed successfully", users)
    );
});

// Block User
exports.blockUser = asyncHandler(async (req, res) => {
    const user = await userService.blockUser(req.params.id);
    res.status(200).json(new ApiResponse(200, "User blocked successfully", user));
});

// Unblock User
exports.unblockUser = asyncHandler(async (req, res) => {
    const user = await userService.unblockUser(req.params.id);
    res.status(200).json(
        new ApiResponse(200, "User unblocked successfully", user)
    );
});

// Verify Email
exports.verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.body;
    await userService.verifyEmail(token);
    res.status(200).json(new ApiResponse(200, "Email verified successfully"));
});

// Resend Verification
exports.resendVerification = asyncHandler(async (req, res) => {
    const { email } = req.body;
    await userService.resendVerification(email);
    res.status(200).json(new ApiResponse(200, "Verification email resent"));
});

// Upload Profile Picture
exports.uploadProfilePicture = asyncHandler(async (req, res) => {
    // Expects a file path/URL in the body; wire up multer here if
    // you need actual multipart file uploads.
    const { filePath } = req.body;
    const user = await userService.uploadProfilePicture(req.user._id, filePath);
    res.status(200).json(
        new ApiResponse(200, "Profile picture uploaded successfully", user)
    );
});

// Delete Account
exports.deleteAccount = asyncHandler(async (req, res) => {
    await userService.deleteAccount(req.user._id);
    res.status(200).json(new ApiResponse(200, "Account deleted successfully"));
});
