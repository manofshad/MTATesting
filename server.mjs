import express from 'express';
import * as abstract from './abstract.mjs';

const app = express();
const port = 8080;

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static('public'));

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://127.0.0.1:${port}`);
});

app.get('/api/data', async (req, res) => {
  try {
    // Await the result of the asynchronous main function
    const data = {
      localTime: await abstract.main(),
      // Add more data as needed
    };

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});