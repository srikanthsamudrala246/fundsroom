"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = 3001;
app.use((0, cors_1.default)());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/action', require('./routes/action'));
app.get("/", (req, res) => {
    res.send("Hello");
});
app.listen(port, () => {
    console.log(`Connected to localhost on port ${port}`);
});
