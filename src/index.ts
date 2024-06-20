import express, { Request, Response } from 'express';
import fs from 'fs';

const app = express();
const port = 3000;
const dbFilePath = 'db.json';

// Middleware to parse JSON requests
app.use(express.json());

// Endpoint to check server status
app.get('/ping', (req: Request, res: Response) => {
  res.send('True');
});

// Endpoint to save submissions
app.post('/submit', (req: Request, res: Response) => {
  const { name, email, phone, github_link, stopwatch_time } = req.body;
  const newSubmission = { name, email, phone, github_link, stopwatch_time };

  let db = [];
  if (fs.existsSync(dbFilePath)) {
    const rawData = fs.readFileSync(dbFilePath);
    db = JSON.parse(rawData.toString());
  }
  db.push(newSubmission);

  fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2));
  res.status(201).send('Submission saved successfully');
});

// Endpoint to read a submission by index
app.get('/read', (req: Request, res: Response) => {
  const index = parseInt(req.query.index as string, 10);

  if (isNaN(index)) {
    res.status(400).send('Invalid index');
    return;
  }

  if (fs.existsSync(dbFilePath)) {
    const rawData = fs.readFileSync(dbFilePath);
    const db = JSON.parse(rawData.toString());

    if (index < 0 || index >= db.length) {
      res.status(404).send('Submission not found');
      return;
    }

    res.status(200).json(db[index]);
  } else {
    res.status(404).send('No submissions found');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
