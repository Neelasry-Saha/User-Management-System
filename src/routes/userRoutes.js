const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect, isAdmin } = require("../middlewares/authMiddleware");
const {
    createUserRules,
    loginRules,
    changePasswordRules,
} = require("../validators/userValidator");

// ---------- Public routes ----------
router.post("/create-user", createUserRules, userController.createUser);
router.post("/login", loginRules, userController.loginUser);
router.post("/verify-email", userController.verifyEmail);
router.post("/resend-verification", userController.resendVerification);
router.get("/search", userController.searchUsers);
router.get("/filter", userController.filterUsers);
router.get("/read-user", userController.readUser);
router.put("/update-user", userController.updateUser);
router.delete("/delete-user", userController.deleteUser);
router.get("/all-users", userController.getAllUsers);
router.get("/user/:id", userController.getUserById);

// ---------- Authenticated user routes (require a valid token) ----------
router.post("/logout", protect, userController.logoutUser);
router.put(
    "/change-password",
    protect,
    changePasswordRules,
    userController.changePassword
);
router.put("/update-profile", protect, userController.updateProfile);
router.post(
    "/upload-profile-picture",
    protect,
    userController.uploadProfilePicture
);
router.delete("/delete-account", protect, userController.deleteAccount);

// ---------- Admin-only routes ----------
router.put("/make-admin/:id", protect, isAdmin, userController.makeAdmin);
router.put("/remove-admin/:id", protect, isAdmin, userController.removeAdmin);
router.patch("/block-user/:id", protect, isAdmin, userController.blockUser);
router.patch(
    "/unblock-user/:id",
    protect,
    isAdmin,
    userController.unblockUser
);

module.exports = router;
