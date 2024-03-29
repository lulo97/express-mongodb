const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware
const User = require('./User.js')

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const connectDB = require("./mongoose.js");
connectDB();

app.use(bodyParser.json());
app.use(cors()); // Use the cors middleware

// Routes

//Homepage
app.get("/", (req, res) => res.send("Express, MongoDB"));

// Create a new user
app.post('/users', async (req, res) => {
    try {
        const { name, age } = req.body;
        const user = new User({ name, age });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user by ID
app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user by ID
app.put('/users/:id', async (req, res) => {
    try {
        const { name, age } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { name, age }, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete user by ID
app.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
