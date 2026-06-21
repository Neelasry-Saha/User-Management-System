const bcrypt = require("bcryptjs");
const crypto = require("crypto");

/**
 * In-memory "model" layer — stands in for a real database so the project
 * structure and API are fully runnable with zero setup.
 *
 * The service layer only depends on these function names/signatures, not
 * on how data is stored. To plug in a real database later (MongoDB,
 * PostgreSQL, etc.), rewrite the bodies below — nothing in routes,
 * controllers, or services needs to change.
 */

let users = [];

const sanitize = (user) => {
    if (!user) return null;
    const { password, verificationToken, ...safe } = user;
    return safe;
};

exports.create = async ({ name, email, password }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
        _id: crypto.randomUUID(),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: "user",
        isVerified: false,
        isBlocked: false,
        profilePicture: "",
        verificationToken: crypto.randomBytes(20).toString("hex"),
        createdAt: new Date().toISOString(),
    };
    users.push(user);
    return sanitize(user);
};

exports.findAll = async () => users.map(sanitize);

exports.findById = async (id) => sanitize(users.find((u) => u._id === id));

exports.findRawById = async (id) => users.find((u) => u._id === id) || null;

exports.findByEmail = async (email) =>
    sanitize(users.find((u) => u.email === email.toLowerCase()));

exports.findRawByEmail = async (email) =>
    users.find((u) => u.email === email.toLowerCase()) || null;

exports.findByVerificationToken = async (token) =>
    users.find((u) => u.verificationToken === token) || null;

exports.updateById = async (id, updates) => {
    const user = users.find((u) => u._id === id);
    if (!user) return null;
    Object.assign(user, updates);
    return sanitize(user);
};

exports.updateByEmail = async (email, updates) => {
    const user = users.find((u) => u.email === email.toLowerCase());
    if (!user) return null;
    Object.assign(user, updates);
    return sanitize(user);
};

exports.updatePassword = async (id, newPassword) => {
    const user = users.find((u) => u._id === id);
    if (!user) return null;
    user.password = await bcrypt.hash(newPassword, 10);
    return sanitize(user);
};

exports.deleteById = async (id) => {
    const index = users.findIndex((u) => u._id === id);
    if (index === -1) return null;
    const [deleted] = users.splice(index, 1);
    return sanitize(deleted);
};

exports.deleteByEmail = async (email) => {
    const index = users.findIndex((u) => u.email === email.toLowerCase());
    if (index === -1) return null;
    const [deleted] = users.splice(index, 1);
    return sanitize(deleted);
};

exports.search = async (query) => {
    if (!query) return [];
    const q = query.toLowerCase();
    return users
        .filter(
            (u) => u.name.toLowerCase().includes(q) || u.email.includes(q)
        )
        .map(sanitize);
};

exports.filter = async ({ role, isBlocked }) => {
    let result = users;
    if (role) result = result.filter((u) => u.role === role);
    if (isBlocked !== undefined) {
        const want = isBlocked === "true" || isBlocked === true;
        result = result.filter((u) => u.isBlocked === want);
    }
    return result.map(sanitize);
};

exports.comparePassword = async (rawUser, candidatePassword) =>
    bcrypt.compare(candidatePassword, rawUser.password);
