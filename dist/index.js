"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const port = 3000;
const dbFilePath = 'db.json';
// Middleware to parse JSON requests
app.use(express_1.default.json());
// Endpoint to check server status
app.get('/ping', (req, res) => {
    res.send('True');
});
// Endpoint to save submissions
app.post('/submit', (req, res) => {
    const { name, email, phone, github_link, stopwatch_time } = req.body;
    const newSubmission = { name, email, phone, github_link, stopwatch_time };
    let db = [];
    if (fs_1.default.existsSync(dbFilePath)) {
        const rawData = fs_1.default.readFileSync(dbFilePath);
        db = JSON.parse(rawData.toString());
    }
    db.push(newSubmission);
    fs_1.default.writeFileSync(dbFilePath, JSON.stringify(db, null, 2));
    res.status(201).send('Submission saved successfully');
});
// Endpoint to read a submission by index
app.get('/read', (req, res) => {
    const index = parseInt(req.query.index, 10);
    if (isNaN(index)) {
        res.status(400).send('Invalid index');
        return;
    }
    if (fs_1.default.existsSync(dbFilePath)) {
        const rawData = fs_1.default.readFileSync(dbFilePath);
        const db = JSON.parse(rawData.toString());
        if (index < 0 || index >= db.length) {
            res.status(404).send('Submission not found');
            return;
        }
        res.status(200).json(db[index]);
    }
    else {
        res.status(404).send('No submissions found');
    }
});
// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
