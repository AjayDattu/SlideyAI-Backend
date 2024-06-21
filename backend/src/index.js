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
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = 3000;
const DB_FILE = path_1.default.resolve(__dirname, 'db.json');
// Middleware to parse JSON request body
app.use(body_parser_1.default.json());
// Endpoint to check server status
app.get('/ping', (req, res) => {
    console.log("Request from", req.accepts);
    res.json(true);
});
// Function to validate email
const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
};
// Function to validate phone number (assuming 10 digit phone number for this example)
const validatePhone = (phone) => {
    const re = /^[0-9]{10}$/;
    return re.test(String(phone));
};
app.post('/submit', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, phone, github_link, stopwatch_time } = req.body;
    console.log('Received submission data:', req.body);
    // Basic validation for required fields
    if (!name || !email || !phone || !github_link || !stopwatch_time) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    // Validate email format
    if (!validateEmail(email)) {
        console.log("invalid email");
        return res.status(400).json({ error: 'Invalid email format' });
    }
    // Validate phone number format
    if (!validatePhone(phone)) {
        console.log("Invalid phn");
        return res.status(400).json({ error: 'Invalid phone number format' });
    }
    const newSubmission = { name, email, phone, github_link, stopwatch_time };
    try {
        // Read current submissions from db.json
        let submissions = [];
        if (fs_1.default.existsSync(DB_FILE)) {
            const data = yield fs_1.default.promises.readFile(DB_FILE, 'utf-8');
            submissions = JSON.parse(data);
        }
        // Check if the email is already registered
        const emailExists = submissions.some(submission => submission.email === email);
        if (emailExists) {
            console.log("email already registered");
            return res.status(400).json({ error: 'Email is already registered' });
        }
        // Add new submission to the list
        submissions.push(newSubmission);
        // Write updated submissions back to db.json
        yield fs_1.default.promises.writeFile(DB_FILE, JSON.stringify(submissions, null, 2));
        // Respond with success message
        res.json({ message: 'Submission saved successfully' });
    }
    catch (error) {
        console.error('Error saving submission:', error);
        res.status(500).json({ error: 'Failed to save submission' });
    }
}));
// Endpoint to read a specific submission by index
app.get('/read', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const index = parseInt(req.query.index, 10);
    // Validate index
    if (isNaN(index) || index < 0) {
        return res.status(400).json({ error: 'Invalid index' });
    }
    try {
        // Read submissions from db.json
        if (fs_1.default.existsSync(DB_FILE)) {
            const data = yield fs_1.default.promises.readFile(DB_FILE, 'utf-8');
            const submissions = JSON.parse(data);
            // Check if index is within range
            if (index >= submissions.length) {
                return res.status(404).json({ error: 'Submission not found' });
            }
            // Return the submission data at the specified index
            res.json(submissions[index]);
        }
        else {
            return res.status(404).json({ error: 'No submissions found' });
        }
    }
    catch (error) {
        console.error('Error reading submissions:', error);
        res.status(500).json({ error: 'Failed to read submissions' });
    }
}));
app.get('/len', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield fs_1.default.promises.readFile(DB_FILE, 'utf-8');
    const submissions = JSON.parse(data);
    res.json(submissions.length);
}));
// Start the server
app.delete('/delete', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    console.log('Received delete request for email:', email);
    // Validate email format
    if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }
    try {
        // Read current submissions from db.json
        let submissions = [];
        if (fs_1.default.existsSync(DB_FILE)) {
            const data = yield fs_1.default.promises.readFile(DB_FILE, 'utf-8');
            submissions = JSON.parse(data);
        }
        // Find the index of the submission with the given email
        const index = submissions.findIndex(submission => submission.email === email);
        // If submission with the given email exists, delete it
        if (index !== -1) {
            submissions.splice(index, 1);
            // Write updated submissions back to db.json
            yield fs_1.default.promises.writeFile(DB_FILE, JSON.stringify(submissions, null, 2));
            res.json({ message: 'Submission deleted successfully' });
        }
        else {
            res.status(404).json({ error: 'Submission not found' });
        }
    }
    catch (error) {
        console.error('Error deleting submission:', error);
        res.status(500).json({ error: 'Failed to delete submission' });
    }
}));
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
