const { body, validationResult } = require("express-validator");
const ApiError = require("../utils/ApiError");

// Runs after the rule chains below; throws a 400 if validation failed
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const message = errors
            .array()
            .map((e) => e.msg)
            .join(", ");
        throw new ApiError(400, message);
    }
    next();
};

const createUserRules = [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("A valid email is required"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
    validate,
];

const loginRules = [
    body("email").isEmail().withMessage("A valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    validate,
];

const changePasswordRules = [
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword")
        .isLength({ min: 6 })
        .withMessage("New password must be at least 6 characters"),
    validate,
];

module.exports = { createUserRules, loginRules, changePasswordRules };
