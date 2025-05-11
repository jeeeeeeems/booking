const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

app.use(express.static('public'));

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

app.get('/api/placeholder/:width/:height', (req, res) => {
  const { width, height } = req.params;
  // Generate or return a placeholder image
  res.send(`Placeholder image ${width}x${height}`);
});

const upload = multer({ storage });

// Upload endpoint
app.post('/api/uploads', upload.array('files'), (req, res) => {
  if (!req.files?.length) return res.status(400).json({ error: 'No files uploaded' });
  res.json({ 
    message: 'Upload successful!',
    files: req.files.map(f => ({
      name: f.originalname,
      size: f.size
    }))
  });
});


// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Upload endpoint: http://localhost:${PORT}/api/uploads`);
});