import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;
const DB_FILE = path.resolve(__dirname, 'db.json');

// Middleware to parse JSON request body
app.use(bodyParser.json());

// Endpoint to check server status
app.get('/ping', (req: Request, res: Response) => {
    console.log("Request from",req.accepts)
    res.json(true);
});

// Function to validate email
const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
};

// Function to validate phone number (assuming 10 digit phone number for this example)
const validatePhone = (phone: string) => {
    const re = /^[0-9]{10}$/;
    return re.test(String(phone));
};

app.post('/submit', async (req: Request, res: Response) => {
    const { name, email, phone, github_link, stopwatch_time } = req.body;
    console.log('Received submission data:', req.body);

    // Basic validation for required fields
    if (!name || !email || !phone || !github_link || !stopwatch_time) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    if (!validateEmail(email)) {
        console.log("invalid email")
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate phone number format
    if (!validatePhone(phone)) {
        return res.status(400).json({ error: 'Invalid phone number format' });
    }

    const newSubmission = { name, email, phone, github_link, stopwatch_time };

    try {
        // Read current submissions from db.json
        let submissions: any[] = [];
        if (fs.existsSync(DB_FILE)) {
            const data = await fs.promises.readFile(DB_FILE, 'utf-8');
            submissions = JSON.parse(data);
        }

        // Check if the email is already registered
        const emailExists = submissions.some(submission => submission.email === email);
        if (emailExists) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        // Add new submission to the list
        submissions.push(newSubmission);

        // Write updated submissions back to db.json
        await fs.promises.writeFile(DB_FILE, JSON.stringify(submissions, null, 2));

        // Respond with success message
        res.json({ message: 'Submission saved successfully' });
    } catch (error) {
        console.error('Error saving submission:', error);
        res.status(500).json({ error: 'Failed to save submission' });
    }
});

// Endpoint to read a specific submission by index
app.get('/read', async (req: Request, res: Response) => {
    const index = parseInt(req.query.index as string, 10);

    // Validate index
    if (isNaN(index) || index < 0) {
        return res.status(400).json({ error: 'Invalid index' });
    }

    try {
        // Read submissions from db.json
        if (fs.existsSync(DB_FILE)) {
            const data = await fs.promises.readFile(DB_FILE, 'utf-8');
            const submissions = JSON.parse(data);

            // Check if index is within range
            if (index >= submissions.length) {
                return res.status(404).json({ error: 'Submission not found' });
            }

            // Return the submission data at the specified index
            res.json(submissions[index]);
        } else {
            return res.status(404).json({ error: 'No submissions found' });
        }
    } catch (error) {
        console.error('Error reading submissions:', error);
        res.status(500).json({ error: 'Failed to read submissions' });
    }
});
app.get('/len',async (req: Request, res: Response)=>{
    const data = await fs.promises.readFile(DB_FILE, 'utf-8');
    const submissions = JSON.parse(data);
    res.json(submissions.length);
})
app.delete('/delete', async (req: Request, res: Response) => {
    const { email } = req.query as { email: string }; 
    console.log('Received delete request for email:', email);

    // Validate email format
    if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    try {
        // Read current submissions from db.json
        let submissions: any[] = [];
        if (fs.existsSync(DB_FILE)) {
            const data = await fs.promises.readFile(DB_FILE, 'utf-8');
            submissions = JSON.parse(data);
        }

        // Find the index of the submission with the given email
        const index = submissions.findIndex(submission => submission.email === email);

        // If submission with the given email exists, delete it
        if (index !== -1) {
            submissions.splice(index, 1);
            // Write updated submissions back to db.json
            await fs.promises.writeFile(DB_FILE, JSON.stringify(submissions, null, 2));
            res.json({ message: 'Submission deleted successfully' });
        } else {
            res.status(404).json({ error: 'Submission not found' });
        }
    } catch (error) {
        console.error('Error deleting submission:', error);
        res.status(500).json({ error: 'Failed to delete submission' });
    }
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
