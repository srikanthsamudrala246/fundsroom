"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUser = exports.validateCredentials = exports.validateUser = void 0;
const zod_1 = __importDefault(require("zod"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nameSchema = zod_1.default.string().min(3);
const emailSchema = zod_1.default.string().email();
const passwordSchema = zod_1.default.string().min(5);
const validateUser = (req, res, next) => {
    const username = req.body["username"];
    const email = req.body["email"];
    const password = req.body["password"];
    const nameResult = nameSchema.safeParse(username);
    const emailResult = emailSchema.safeParse(email);
    const passwordResult = passwordSchema.safeParse(password);
    if (nameResult.success && emailResult.success && passwordResult.success) {
        next();
    }
    else {
        next({ status: 400, success: false, error: "Invalid username or password" });
    }
};
exports.validateUser = validateUser;
const validateCredentials = (req, res, next) => {
    const email = req.body["email"];
    const password = req.body["password"];
    const emailResult = emailSchema.safeParse(email);
    const passwordResult = zod_1.default.string().min(1).safeParse(password);
    console.log();
    if (emailResult.success && passwordResult.success) {
        next();
    }
    else {
        next({ status: 400, success: false, error: "Invalid username or password" });
    }
};
exports.validateCredentials = validateCredentials;
const fetchUser = (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        return res
            .status(400)
            .json({ error: "Please validate using valid auth token..." });
    }
    try {
        const data = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
        req.body['user'] = data.user;
        next();
    }
    catch (error) {
        res.status(400).json({ error: "Please authenticate using valid token..." });
    }
};
exports.fetchUser = fetchUser;
