import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;
const PAY_FILE_PATH = path.join(__dirname, 'pay.json');

app.use(express.json());

app.post('/save-details', (req, res) => {
  const { upiId, amount, name } = req.body;
  
  if (!upiId || !name) {
    return res.status(400).json({ error: "UPI ID and name are required." });
  }

  const newEntry = {
    upiId,
    amount,
    name,
    timestamp: new Date().toISOString()
  };

  fs.readFile(PAY_FILE_PATH, 'utf8', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      return res.status(500).json({ error: "Failed to read pay.json" });
    }

    const payments = data ? JSON.parse(data) : [];
    payments.push(newEntry);

    fs.writeFile(PAY_FILE_PATH, JSON.stringify(payments, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to save to pay.json" });
      }
      res.status(200).json({ message: "Details saved successfully!" });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
