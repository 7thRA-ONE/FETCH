const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
const options = {
  socketTimeoutMS: 30000,
};

// Update the connection string with your credentials and database name
const config = 'mongodb+srv://Ladybug:hDpPId1zTHaqS1Ph@blaze.b4faulz.mongodb.net/myDatabaseName';

const db1 = mongoose.createConnection(config, options);  
// Define rating schema and model
const ratingSchema = new mongoose.Schema({
  value: { type: Number, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}); 

const Rating = db1.model("Rating", ratingSchema);

// Middleware to parse JSON bodies
app.use(express.json());

// Serve the HTML file
app.use(express.static('public'));

// Route to serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint to save the rating
app.post('/api/rate', (req, res) => {
    const { value, name, email } = req.body;

    if (!value || !name || !email) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const newRating = new Rating({ value, name, email });

    newRating.save()
    .then(savedRating => {
        console.log('Rating saved:', savedRating);
        res.status(201).json(savedRating);
    })
    .catch(err => {
        console.error('Error saving rating:', err);
        res.status(500).send('Error saving rating');
    });
});

// API endpoint to get all ratings
app.get('/api/ratings', async (req, res) => {
    try {
        const ratings = await Rating.find();
        res.json(ratings);
    } catch (err) {
        console.error('Error fetching ratings:', err);
        res.status(500).send('Error fetching ratings');
    }
});

// API endpoint to get average rating
app.get('/api/average-rating', async (req, res) => {
    try {
        const ratings = await Rating.find();
        const totalRatings = ratings.length;
        if (totalRatings === 0) {
            return res.json({ averageRating: 0 });
        }
        const totalSum = ratings.reduce((acc, cur) => acc + cur.value, 0);
        const averageRating = totalSum / totalRatings;
        res.json({ averageRating });
    } catch (err) {
        console.error('Error calculating average rating:', err);
        res.status(500).send('Error calculating average rating');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
