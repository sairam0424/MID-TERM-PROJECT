/**
 * Module dependencies.
 */
const express = require('express'); // Fast, unopinionated, minimalist web framework for Node.js
const mongoose = require('mongoose'); // MongoDB object modeling tool designed to work in an asynchronous environment
const session = require('express-session'); // Session middleware for Express.js to manage session state
const path = require('path'); // Provides utilities for working with file and directory paths
const bcrypt = require('bcryptjs'); // Library to hash passwords securely to store the password in an hash format
const User = require('./models/user.model'); // User model for interacting with user data
const Product = require('./models/product.model'); // Product model for interacting with product data



const router = express.Router();

const app = express();
const PORT = process.env.PORT || 8081;
const dbConfig = require('./config/dbconfig');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'my-secret-key',
  resave: true,
  saveUninitialized: true
}));

// Set up views directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// MongoDB connection setup to Datadb
mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/Datadb`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));


// GET all products
router.get('/', async (req, res) => {
  try {
      const products = await Product.find();
      res.render('home', { products, currentUser: req.session.currentUser });
  } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).send('Internal Server Error');
  }
});

// POST create new product
router.post('/create', async (req, res) => {
  const { productName, productCost, productInfo } = req.body;
  try {
      const newProduct = new Product({ productName, productCost, productInfo });
      await newProduct.save();
      res.redirect('/');
  } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).send('Internal Server Error');
  }
});

// POST delete product
router.post('/delete/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
      await Product.findByIdAndDelete(productId);
      res.redirect('/');
  } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).send('Internal Server Error');
  }
});

// GET update product form
router.get('/update/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
      const product = await Product.findById(productId);
      res.render('update-product', { product });
  } catch (error) {
      console.error('Error fetching product for update:', error);
      res.status(500).send('Internal Server Error');
  }
});

// POST update product
router.post('/update/:productId', async (req, res) => {
  const { productId } = req.params;
  const { productName, productCost, productInfo } = req.body;
  try {
      await Product.findByIdAndUpdate(productId, { productName, productCost, productInfo });
      res.redirect('/');
  } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).send('Internal Server Error');
  }
});

module.exports = router;


// Routes

// Home route
app.get('/', (req, res) => {
  if (req.session.currentUser) {
    res.render('home', { currentUser: req.session.currentUser });
  } else {
    res.redirect('/login');
  }
});

// Login route - GET
app.get('/login', (req, res) => {
  res.render('login');
});

// Login route - POST (handling login form submission)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).send('Invalid password');
    }

    // Store user info in session
    req.session.currentUser = { _id: user._id, username: user.username };

    // Redirect to home page
    res.redirect('/');
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Signup route - GET
app.get('/signup', (req, res) => {
  res.render('signup');
});

// Signup route - POST (handling signup form submission)
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if username already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).send('Username already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    // Redirect to login page after successful signup
    res.redirect('/login');
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.redirect('/login');
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
