import apiClient from './apiClient';

export const fetchRecipes = (params = {}) => apiClient.get('/recipes/search', { params });

export const fetchRandomRecipes = (number = 20) => apiClient.get('/recipes/random', { params: { number } });

export const fetchRecipeDetails = (id) => apiClient.get(`/recipes/${id}/information`);
