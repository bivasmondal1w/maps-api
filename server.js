const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Your SerpAPI Key
const SERP_API_KEY = '8ea1aaed82409533c6f771cb316dcf3ed54694692fa3e98a4dff6fc2c43ad23a';

app.post('/maps-leads', async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ success: false, message: 'Query is required' });
  }

  try {
    const url = `https://serpapi.com/search.json?engine=google_maps&q=${encodeURIComponent(query)}&type=search&api_key=${SERP_API_KEY}`;

    const response = await axios.get(url);
    const places = response.data.local_results || [];

    const leads = places.map(place => ({
      name: place.title,
      phone: place.phone,
      address: place.address,
      rating: place.rating,
      reviews: place.reviews,
      website: place.website
    }));

    res.json({ success: true, count: leads.length, leads });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch data. Try again later.' });
  }
});

app.get('/', (req, res) => {
  res.send('✅ Google Maps Scraper API is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
      
