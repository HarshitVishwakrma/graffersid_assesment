const express = require('express');
const router = express.Router();
const Company = require('../models/Company');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/logos';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'logo-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});




// Get all companies with search and filter
router.get('/', async (req, res) => {
  try {
    const { search, city, sortBy } = req.query;
    let query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by city
    if (city) {
      query.city = { $regex: `^${city}$`, $options: 'i' };
    }

    // Sorting
    let sort = { createdAt: -1 }; // Default: newest first
    if (sortBy === 'name') sort = { name: 1 };
    if (sortBy === 'rating') sort = { averageRating: -1 };

    const companies = await Company.find(query).sort(sort);
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching companies', error: error.message });
  }
});

// Get single company by ID
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching company', error: error.message });
  }
});

// Create new company
router.post('/', upload.single('logo'), async (req, res) => {
  try {
    const { name, location, foundedOn, city, description } = req.body;

    // Check if logo file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Logo file is required' });
    }

    // Construct the logo URL/path
    const logoPath = `/uploads/logos/${req.file.filename}`;

    const company = new Company({
      name,
      location,
      foundedOn,
      city,
      logo: logoPath, // Store the file path
      description: description || '', // Optional field
    });

    const savedCompany = await company.save();
    res.status(201).json(savedCompany);
  } catch (error) {
    // If there was an error, delete the uploaded file
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    res.status(400).json({ message: 'Error creating company', error: error.message });
  }
});

// Update company
router.put('/:id', async (req, res) => {
  try {
    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json(updatedCompany);
  } catch (error) {
    res.status(400).json({ message: 'Error updating company', error: error.message });
  }
});

// Delete company
router.delete('/:id', async (req, res) => {
  try {
    const deletedCompany = await Company.findByIdAndDelete(req.params.id);
    if (!deletedCompany) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting company', error: error.message });
  }
});

module.exports = router;