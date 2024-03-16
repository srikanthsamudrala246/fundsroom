"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../middlewares/user");
const db_1 = require("../db");
dotenv_1.default.config();
const router = express_1.default.Router();
router.post("/signup", user_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    const email = req.body.email;
    try {
        const existingUser = yield db_1.prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (existingUser) {
            res.status(400).json({ success, error: "User already exists..." });
        }
        else {
            const salt = yield bcryptjs_1.default.genSalt(10);
            const secPass = yield bcryptjs_1.default.hash(req.body.password, salt);
            const userDetails = yield db_1.prisma.user.create({
                data: {
                    email: email,
                    password: secPass,
                    username: req.body.username,
                },
                select: {
                    userId: true,
                },
            });
            const secret = process.env.JWT_SECRET || "";
            const data = {
                user: {
                    id: userDetails.userId,
                },
            };
            const authToken = jsonwebtoken_1.default.sign(data, secret);
            success = true;
            res.status(200).json({ success, authToken });
        }
    }
    catch (error) {
        success = false;
        return res.status(500).json({ success, error: "Internal server error..." });
    }
}));
router.post('/login', user_1.validateCredentials, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    const { email, password } = req.body;
    try {
        const userDetails = yield db_1.prisma.user.findUnique({
            where: {
                email: email
            },
            select: {
                username: true,
                password: true,
                userId: true
            }
        });
        if (!userDetails) {
            return res.status(400).json({ success, error: "Invalid username or password..." });
        }
        const match = yield bcryptjs_1.default.compare(password, userDetails.password);
        if (!match) {
            return res.status(400).json({ success, error: "Invalid username or password..." });
        }
        const secret = process.env.JWT_SECRET || "";
        const data = {
            user: {
                id: userDetails.userId,
            },
        };
        const authToken = jsonwebtoken_1.default.sign(data, secret);
        success = true;
        const username = userDetails.username;
        res.status(200).json({ success, authToken, username });
    }
    catch (error) {
        success = false;
        return res.status(500).json({ success, error: "Internal server error..." });
    }
}));
module.exports = router;
