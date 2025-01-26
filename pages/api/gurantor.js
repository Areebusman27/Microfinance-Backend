const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/loanManagement', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define the Guarantor Schema
const guarantorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  cnic: {
    type: String,
    required: true,
    unique: true,
    match: /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/,
  },
  phoneNumber: {
    type: String,
    required: true,
    match: /^[0-9]{4}-[0-9]{7}$/,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
}, { timestamps: true });

const Guarantor = mongoose.model('Guarantor', guarantorSchema);

// Initialize Express App
const app = express();
app.use(bodyParser.json());

// API Routes

// 1. Create a New Guarantor
app.post('/api/guarantors', async (req, res) => {
  try {
    const guarantor = new Guarantor(req.body);
    await guarantor.save();
    res.status(201).json({ message: 'Guarantor created successfully!', guarantor });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 2. Get All Guarantors
app.get('/api/guarantors', async (req, res) => {
  try {
    const guarantors = await Guarantor.find();
    res.status(200).json(guarantors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Get a Guarantor by ID
app.get('/api/guarantors/:id', async (req, res) => {
  try {
    const guarantor = await Guarantor.findById(req.params.id);
    if (!guarantor) {
      return res.status(404).json({ message: 'Guarantor not found' });
    }
    res.status(200).json(guarantor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Update a Guarantor by ID
app.put('/api/guarantors/:id', async (req, res) => {
  try {
    const guarantor = await Guarantor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!guarantor) {
      return res.status(404).json({ message: 'Guarantor not found' });
    }
    res.status(200).json({ message: 'Guarantor updated successfully!', guarantor });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 5. Delete a Guarantor by ID
app.delete('/api/guarantors/:id', async (req, res) => {
  try {
    const guarantor = await Guarantor.findByIdAndDelete(req.params.id);
    if (!guarantor) {
      return res.status(404).json({ message: 'Guarantor not found' });
    }
    res.status(200).json({ message: 'Guarantor deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
