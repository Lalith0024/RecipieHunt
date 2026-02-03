import React, { useState, useEffect } from 'react';
import '../styles/Category.css';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import ApiErrorUI from '../components/ApiErrorUI.jsx';
import RecipeCard from '../components/Recipe/RecipeCard.jsx';
import RecipeModal from '../components/Recipe/RecipeModal.jsx';
import { fetchRecipes } from '../services/recipeService';
import useRecipeModal from '../hooks/useRecipeModal';
import useSEO from '../hooks/useSEO';

import { CATEGORIES, TIME_FILTERS } from '../utils/Constants';
import Loader from '../components/Common/Loader.jsx';

function Category() {
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [maxTime, setMaxTime] = useState(0);
  const [vegOnly, setVegOnly] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const { selectedRecipe, modalOpen, modalLoading, openModal, closeModal } = useRecipeModal();

  useSEO(
    "Recipe Categories",
    "Browse recipes by category. Whether it's pizza, pasta, or healthy salads, find the perfect dish on RecipeHunt."
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      loadRecipes();
    }, 500);
    return () => clearTimeout(timer);
  }, [category, maxTime, search, vegOnly]);

  const loadRecipes = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const params = {
        number: 20,
        type: category,
        query: search,
        maxReadyTime: maxTime > 0 ? maxTime : '',
        diet: vegOnly ? 'vegetarian' : ''
      };

      const data = await fetchRecipes(params);
      setRecipes(data.results || []);
    } catch (err) {
      setApiError(err.message === 'limit' ? 'limit' : 'server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper category-page">
      <Header />

      <main className="category-page-content">
        <section className="category-hero-header">
          <div className="main-container">
            <h1 className="cat-page-title">Culinary Categories</h1>
            <p className="cat-page-subtitle">Discover the perfect recipe for every mood, taste, and occasion.</p>

            <div className="category-search-wrapper">
              <div className="category-search-box">
                <input
                  type="text"
                  placeholder="Search for your favorite flavors..."
                  className="hero-search-input"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="hero-search-btn">Search</button>
              </div>
            </div>
          </div>
        </section>

        <section className="category-filter-section">
          <div className="main-container">
            <div className="cat-scroll-wrapper">
              <div
                className={`cat-item ${category === '' ? 'active' : ''}`}
                onClick={() => setCategory('')}
              >
                <div className="cat-img-box">
                  <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=500" alt="All Food" />
                </div>
                <span className="cat-name">Discover All</span>
              </div>
              {CATEGORIES.map((cat, i) => (
                <div key={i} className={`cat-item ${category === cat.name ? 'active' : ''}`} onClick={() => setCategory(cat.name)}>
                  <div className="cat-img-box">
                    <img src={cat.img} alt={cat.name} />
                  </div>
                  <span className="cat-name">{cat.name}</span>
                </div>
              ))}
            </div>

            <div className="advanced-filters-row">
              <div className="filter-group">
                <span className="filter-label">Ready Within:</span>
                {TIME_FILTERS.map(tf => (
                  <button
                    key={tf.value}
                    className={`pill ${maxTime === tf.value ? 'active' : ''}`}
                    onClick={() => setMaxTime(tf.value)}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>

              <div className="active-separator"></div>

              <div className="filter-group">
                <button
                  className={`pill ${vegOnly ? 'active' : ''}`}
                  onClick={() => setVegOnly(!vegOnly)}
                >
                  {vegOnly ? '✓ Vegetarian' : 'Vegetarian Only'}
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="main-container recipe-container-box">
          {loading ? (
            <Loader message="Gathering the best recipes..." />
          ) : apiError ? (
            <ApiErrorUI type={apiError} />
          ) : (
            <>
              {recipes.length === 0 ? (
                <div className="no-results">
                  <h2>No recipes found matching your filters.</h2>
                  <p>Try adjusting your search or category.</p>
                </div>
              ) : (
                <div className="recipe-grid">
                  {recipes.map(recipe => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onClick={openModal}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

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

export default Category;
