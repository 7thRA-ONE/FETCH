const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
 const maker = require("logomaker")
const fetch = require('node-fetch'); // Don't forget to import 'node-fetch'
const fs = require('fs');
// Connect to MongoDB
const options = {
  socketTimeoutMS: 30000,
};

// Update the connection string with your credentials and database name
const config = 'mongodb+srv://Ladybug:hDpPId1zTHaqS1Ph@blaze.b4faulz.mongodb.net/?retryWrites=true&w=majority';

const db1 = mongoose.createConnection(config, options);  
// Define rating schema and model
const ratingSchema = new mongoose.Schema({
  value: { type: Number, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Ensure uniqueness
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
app.post('/api/rate', async (req, res) => {
    const { value, name, email } = req.body;

    if (!value || !name || !email) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const newRating = new Rating({ value, name, email });

        await newRating.save();
        console.log('Rating saved:', newRating);
        res.status(201).json(newRating);
    } catch (err) {
        if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
            // Duplicate key error for email
            return res.status(400).json({ error: "Email already exists, cannot rate again" });
        }
        console.error('Error saving rating:', err);
        res.status(500).send('Error saving rating');
    }
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



app.get('/api/logo/phub', async (req, res) => {
  const { text } = req.query;

  if (!text || !text.includes("|")) {
    return res.status(400).json({ error: "Invalid input. Example: /pornhub?text=RA_ONE" });
  }

  try {
    const teksParts = text.split("|");
    const teks1 = teksParts[0];
    const teks2 = teksParts[1];

    const response = await maker.textpro(
      "https://textpro.me/pornhub-style-logo-online-generator-free-977.html",
      [`${teks1}`, `${teks2}`]
    );

    let botName = `Zero-TWO`
    const imageUrl = response.image;
    const caption = `Made by ${botName}`;

    return res.json({ image: imageUrl, caption: caption });
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).json({ error: "An error occurred while processing the request" });
  }
});

app.get('/api/logo/naruto', async (req, res) => {
  const { text } = req.query;
  try {
    const response = await maker.textpro(
      "https://textpro.me/create-naruto-logo-style-text-effect-online-1125.html",
      [`${text}`]
    );

    let botName = `Zero-TWO`
    const imageUrl = response.image;
    const caption = `Made by ${botName}`;

    return res.json({ image: imageUrl, caption: caption });
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).json({ error: "An error occurred while processing the request" });
  }
});

app.get('/api/logo/devil', async (req, res) => {
  const { text } = req.query;
  try {
    const response = await  maker.textpro(
      "https://textpro.me/create-neon-devil-wings-text-effect-online-free-1014.html",
      [`${text}`]
    )

    let botName = `Zero-TWO`
    const imageUrl = response.image;
    const caption = `Made by ${botName}`;

    return res.json({ image: imageUrl, caption: caption });
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).json({ error: "An error occurred while processing the request" });
  }
});

app.get('/api/logo/carbon', async (req, res) => {
  const { text } = req.query;
  try {
    const response = await fetch('https://carbonara.solopov.dev/api/cook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: text,
        backgroundColor: '#1F816D',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate logo');
    }

    const imageData = await response.buffer(); // Get the response body as a buffer
    const fileName = `Carbons.png`;
    const filePath = path.join(__dirname, fileName);

    fs.writeFileSync(filePath, imageData); // Write the buffer to a file

    const botName = 'Zero-TWO';
    const caption = `Made by ${botName}`;

    res.sendFile(filePath, {
      dotfiles: 'deny',
      headers: {
        'Content-Type': 'image/png', // Set appropriate Content-Type
      }
    }, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        if (err.code === 'ENOENT') {
          res.status(404).send('File not found');
        } else {
          res.status(500).send('Internal server error');
        }
      } else {
        console.log('File sent successfully');
        fs.unlinkSync(filePath); // Delete the temporary file after sending
      }
    });
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).json({ error: "An error occurred while processing the request" });
  }
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});