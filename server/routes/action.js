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
const user_1 = require("../middlewares/user");
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("../db");
const router = express_1.default.Router();
dotenv_1.default.config();
router.put('/makePayment', user_1.fetchUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.body['user'].id;
    let success = false;
    const amount = req.body.amount;
    try {
        yield db_1.prisma.user.update({
            data: {
                due: {
                    increment: amount
                },
                limit: {
                    decrement: amount
                }
            },
            where: {
                userId: id
            }
        });
        success = true;
        return res.json({ success, message: "Payment successful..." });
    }
    catch (error) {
        success = false;
        res.status(400).json({ success, error: "Please validate using a valid AuthToken..." });
    }
}));
router.get('/generateBill', user_1.fetchUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.body['user'].id;
    let success = true;
    try {
        const userDetails = yield db_1.prisma.user.findUnique({
            where: {
                userId: id
            },
            select: {
                due: true
            }
        });
        if (!userDetails) {
            success = false;
            res.status(400).json({ success, error: "Invalid Authorization..." });
        }
        const dueAmount = userDetails === null || userDetails === void 0 ? void 0 : userDetails.due;
        success = true;
        return res.json({ success, dueAmount });
    }
    catch (error) {
        success = false;
        return res.status(400).json({ success, error: "Internal server error..." });
    }
}));
router.get('/fetchLimit', user_1.fetchUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.body['user'].id;
    let success = false;
    try {
        const userDetails = yield db_1.prisma.user.findUnique({
            where: {
                userId: id
            },
            select: {
                limit: true
            }
        });
        if (!userDetails) {
            return res.status(400).json({ success, error: "Unauthorized access..." });
        }
        ;
        success = true;
        return res.json({ success, limit: userDetails.limit });
    }
    catch (error) {
        success = false;
        return res.status(500).json({ success, error: "Internal server error..." });
    }
}));
router.put('/payPending', user_1.fetchUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.body['user'].id;
    let success = false;
    try {
        const userDetails = yield db_1.prisma.user.findUnique({
            where: {
                userId: id
            },
            select: {
                due: true
            }
        });
        if (!userDetails) {
            res.status(400).json({ success, error: "Invalid Authorization..." });
        }
        const dueAmount = userDetails === null || userDetails === void 0 ? void 0 : userDetails.due;
        yield db_1.prisma.user.update({
            data: {
                due: {
                    decrement: dueAmount,
                },
                limit: {
                    increment: dueAmount
                }
            },
            where: {
                userId: id
            }
        });
        success = true;
        return res.json({ success, message: "Payment successful..." });
    }
    catch (error) {
        success = false;
        return res.status(500).json({ success, error: "Internal server error..." });
    }
}));
module.exports = router;
