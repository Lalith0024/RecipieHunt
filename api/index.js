import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY || 'd5dc6a6d47af468fa68072cc1f0700b9';

app.use(cors());
app.use(express.json());

// Helper to handle Spoonacular errors
const handleApiError = (err, res) => {
  if (err.response) {
    return res.status(err.response.status).json({ error: err.response.data });
  }
  return res.status(500).json({ error: 'Internal Server Error' });
};

// Search with advanced filtering
app.get('/api/recipes/search', async (req, res) => {
  const { query, type, diet, maxReadyTime, number = 20 } = req.query;
  try {
    let params = {
      apiKey: SPOONACULAR_API_KEY,
      number,
      addRecipeInformation: true,
      fillIngredients: true
    };
    if (query) params.query = query;
    if (diet) params.diet = diet;
    if (maxReadyTime) params.maxReadyTime = maxReadyTime;

    const validTypes = ['main course', 'side dish', 'dessert', 'appetizer', 'salad', 'bread', 'breakfast', 'soup', 'beverage', 'sauce', 'marinade', 'fingerfood', 'snack', 'drink'];
    if (type) {
      if (validTypes.includes(type.toLowerCase())) {
        params.type = type.toLowerCase();
      } else {
        params.query = query ? `${query} ${type}` : type;
      }
    }
    const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', { params });
    let results = response.data.results;
    if (query || (type && !validTypes.includes(type.toLowerCase()))) {
      const searchTerm = (query || type).toLowerCase();
      results = results.sort((a, b) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        const aHas = aTitle.includes(searchTerm);
        const bHas = bTitle.includes(searchTerm);
        if (aHas && !bHas) return -1;
        if (!aHas && bHas) return 1;
        return 0;
      });
    }
    res.json({ results });
  } catch (err) {
    handleApiError(err, res);
  }
});

app.get('/api/recipes/random', async (req, res) => {
  const { number = 20, tags } = req.query;
  try {
    const response = await axios.get('https://api.spoonacular.com/recipes/random', {
      params: { apiKey: SPOONACULAR_API_KEY, number, tags }
    });
    res.json({ recipes: response.data.recipes });
  } catch (err) {
    handleApiError(err, res);
  }
});

app.get('/api/recipes/:id/information', async (req, res) => {
  try {
    const response = await axios.get(`https://api.spoonacular.com/recipes/${req.params.id}/information`, {
      params: { apiKey: SPOONACULAR_API_KEY }
    });
    res.json(response.data);
  } catch (err) {
    handleApiError(err, res);
  }
});

// For local development
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}

export default app;
