const express = require('express');
const router = express.Router();
const User = require('../models/product.model'); // Adjust the path as per your project structure
const multer = require('multer');
const fs = require('fs').promises; // Using fs.promises for async file operations

// Multer configuration for file upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads"); // Destination directory for file uploads
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname); // Unique file name generation
    },
});

const upload = multer({ storage }).single("image"); // Single file upload middleware

// Route to render home page with all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.render('home', { title: 'Home Page', users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Route to render add users form
router.get('/add', (req, res) => {
    res.render('add_users', { title: "Add users" });
});

// POST route to add a new user
router.post('/add', upload, async (req, res) => {
    try {
        // Extract data from request
        const { name, email, phone } = req.body;
        const image = req.file ? req.file.filename : 'default.jpg'; // Default image if no file uploaded

        // Create new user object
        const user = new User({ name, email, phone, image });

        // Save user to database
        await user.save();

        // Set session message for success
        req.session.message = { type: 'success', message: 'User added successfully' };

        // Redirect to home page
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.json({ message: err.message, type: 'danger' }); // Return error message as JSON
    }
});

// Route to render edit user form
router.get('/edit/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);

        if (!user) {
            return res.redirect('/');
        }

        res.render('edit_users', {
            title: 'Edit User',
            user: user,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update user route
router.post('/update/:id', upload, async (req, res) => {
    try {
        const id = req.params.id;

        // Find the user by ID
        let user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prepare updated user data
        user.name = req.body.name;
        user.email = req.body.email;
        user.phone = req.body.phone;

        // Check if a new image was uploaded
        if (req.file) {
            // Delete old image if it exists
            if (user.image) {
                try {
                    await fs.unlink("uploads/" + user.image);
                } catch (err) {
                    console.error('Error deleting old image:', err);
                }
            }
            // Save new image filename
            user.image = req.file.filename;
        }

        // Save updated user data
        await user.save();

        req.session.message = {
            type: 'success',
            message: 'User updated successfully',
        };

        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Delete user route
// Delete user route
router.get('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Find the user by ID
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete user document from database
        await User.deleteOne({ _id: id });

        // If user had an image, delete it from uploads directory
        if (user.image) {
            await fs.unlink("uploads/" + user.image);
        }

        req.session.message = {
            type: 'info',
            message: 'User deleted successfully'
        };

        res.redirect('/');
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});



module.exports = router;