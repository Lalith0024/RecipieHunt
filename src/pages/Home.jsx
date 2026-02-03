import React, { useState, useEffect } from 'react';
import '../styles/Home.css';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import ApiErrorUI from '../components/ApiErrorUI.jsx';
import RecipeCard from '../components/Recipe/RecipeCard.jsx';
import RecipeModal from '../components/Recipe/RecipeModal.jsx';
import { fetchRandomRecipes, fetchRecipes } from '../services/recipeService';
import useRecipeModal from '../hooks/useRecipeModal';
import useSEO from '../hooks/useSEO';
import { HOME_PILLS } from '../utils/Constants';
import Loader from '../components/Common/Loader.jsx';

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [apiError, setApiError] = useState(null);

  const { selectedRecipe, modalOpen, modalLoading, openModal, closeModal } = useRecipeModal();

  useSEO(
    "Discover Delicious Recipes",
    "Find your favorite meals on RecipeHunt - the best platform for homemakers and food lovers."
  );

  useEffect(() => {
    loadInitialRecipes();
  }, []);

  const loadInitialRecipes = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const data = await fetchRandomRecipes(20);
      setRecipes(data.recipes || []);
      setFilteredRecipes(data.recipes || []);
    } catch (err) {
      setApiError(err.message === 'limit' ? 'limit' : 'server');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    setLoading(true);
    setApiError(null);
    setActiveFilter('All');
    try {
      const data = await fetchRecipes({ query: search, number: 20 });
      setRecipes(data.results || []);
      setFilteredRecipes(data.results || []);
      const filterBar = document.querySelector('.filters-bar');
      if (filterBar) filterBar.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      setApiError(err.message === 'limit' ? 'limit' : 'server');
    } finally {
      setLoading(false);
    }
  };

  const applyPillFilter = (pill) => {
    setActiveFilter(pill);
    let filtered = [...recipes];
    if (pill === 'Veg') filtered = recipes.filter(r => r.vegetarian);
    if (pill === 'Healthy') filtered = recipes.filter(r => r.healthScore > 50);
    if (pill === 'Quick') filtered = recipes.filter(r => r.readyInMinutes <= 30);
    if (pill === 'All') filtered = recipes;
    setFilteredRecipes(filtered);
  };

  return (
    <div className="page-wrapper home-page">
      <Header />

      <section className="hero-wrapper">
        <div className="main-container">
          <div className="hero-grid">
            <div className="hero-text">
              <span className="hero-tag">The ultimate kitchen companion</span>
              <h1 className="hero-title">Delicious Recipes <span>at Your Fingertips.</span></h1>
              <div className="hero-search-container">
                <form onSubmit={handleSearch} className="hero-search-bar">
                  <input
                    type="text"
                    placeholder="Search for 'Spicy Pasta' or 'Vegan Bowl'..."
                    className="hero-search-input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button type="submit" className="hero-search-btn">Search</button>
                </form>
              </div>
            </div>
            <div className="hero-image-side">
              <img src="/hero_main.png" alt="Featured Dish" className="floating-dish" />
            </div>
          </div>
        </div>
      </section>

      <div className="filters-bar">
        <div className="main-container">
          <div className="filter-pills">
            {HOME_PILLS.map(pill => (
              <button
                key={pill}
                className={`pill ${activeFilter === pill ? 'active' : ''}`}
                onClick={() => applyPillFilter(pill)}
              >
                {pill}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="main-container recipe-section">
        {loading ? (
          <Loader message="Searching for culinary magic..." />
        ) : apiError ? (
          <ApiErrorUI type={apiError} />
        ) : (
          <div className="recipe-grid">
            {filteredRecipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={openModal}
              />
            ))}
          </div>
        )}
      </div>

      <RecipeModal
        isOpen={modalOpen}
        isLoading={modalLoading}
        recipe={selectedRecipe}
        onClose={closeModal}
      />
      <Footer />
    </div>
  );
}

export default Home;