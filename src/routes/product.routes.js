
const express = require('express');
const router = express.Router();

const Product = require('../models/product.model'); // Assuming 'product.model.js' defines Product schema
const multer = require('multer');

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads');
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage }).single("image");

// Route to render home page
router.get('/', async (req, res) => {
  try {
    const users = await Product.find();
    res.render('home', { title: 'Home Page', users, currentUser: req.session.currentUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route to render add user form
router.get('/add', (req, res) => {
  res.render('add_users', { title: "Add User", currentUser: req.session.currentUser });
});

// Post route to add a new user
router.post('/add', upload, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const image = req.file.filename;
    const user = new Product({ name, email, phone, image });
    await user.save();
    req.session.message = { type: 'success', message: 'User added successfully' };
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.json({ message: err.message, type: 'danger' });
  }
});

// Route to get all users
router.get('/users', async (req, res) => {
  try {
    const users = await Product.find();
    res.render('index', { title: 'All Users', users, currentUser: req.session.currentUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
