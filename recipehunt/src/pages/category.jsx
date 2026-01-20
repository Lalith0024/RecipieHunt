import React, { useState, useEffect } from 'react';
import '../style/category.css';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';
import ApiErrorUI from '../components/ApiErrorUI.jsx';

const API_KEY = 'd5dc6a6d47af468fa68072cc1f0700b9';

const CATEGORIES = [
  { name: 'Pizza', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=500' },
  { name: 'Burger', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=500' },
  { name: 'Pasta', img: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=500' },
  { name: 'Appetizer', img: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=500' },
  { name: 'Salad', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=500' },
  { name: 'Dessert', img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=500' },
  { name: 'Beverage', img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=500' },
  { name: 'Soup', img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=500' },
];

const TIME_FILTERS = [
  { label: 'Any Time', value: 0 },
  { label: 'Under 15m', value: 15 },
  { label: 'Under 30m', value: 30 },
  { label: 'Under 45m', value: 45 },
];

function Category() {
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [maxTime, setMaxTime] = useState(0);
  const [vegOnly, setVegOnly] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRecipes();
    }, 500);
    return () => clearTimeout(timer);
  }, [category, maxTime, search, vegOnly]);

  const fetchRecipes = async () => {
    setLoading(true);
    setApiError(null);
    try {
      let url = `https://api.spoonacular.com/recipes/complexSearch?number=20&addRecipeInformation=true&apiKey=${API_KEY}`;
      if (category) url += `&type=${encodeURIComponent(category.toLowerCase())}`;
      if (search) url += `&query=${encodeURIComponent(search)}`;
      if (maxTime > 0) url += `&maxReadyTime=${maxTime}`;
      if (vegOnly) url += `&diet=vegetarian`;

      const res = await fetch(url);
      if (res.status === 402 || res.status === 429) {
        setApiError('limit');
        return;
      }
      if (!res.ok) {
        setApiError('server');
        return;
      }
      const data = await res.json();
      setRecipes(data.results || []);
    } catch (err) {
      console.error(err);
      setApiError('server');
    } finally {
      setLoading(false);
    }
  };

  const openModal = async (recipeId) => {
    setModalOpen(true);
    setModalLoading(true);
    try {
      const res = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`);
      const data = await res.json();
      setSelectedRecipe(data);
    } catch (err) {
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
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

        <div className="main-container" style={{ minHeight: '400px', paddingTop: '40px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px 0', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
              Gathering the best recipes...
            </div>
          ) : apiError ? (
            <ApiErrorUI type={apiError} />
          ) : (
            <>
              {recipes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>
                  <h2>No recipes found matching your filters.</h2>
                  <p>Try adjusting your search or category.</p>
                </div>
              ) : (
                <div className="recipe-grid">
                  {recipes.map(recipe => (
                    <div key={recipe.id} className="recipe-card" onClick={() => openModal(recipe.id)}>
                      <div className="card-img-wrapper">
                        <img src={recipe.image} alt={recipe.title} className="card-img" />
                        <div className="card-overlay">
                          <span className="card-time">{recipe.readyInMinutes} MINS</span>
                        </div>
                      </div>
                      <div className="card-info">
                        <h3 className="card-title">{recipe.title}</h3>
                        <div className="card-meta">
                          <span className="rating-star">★ {(recipe.healthScore / 20).toFixed(1)}</span>
                          <span>•</span>
                          <span>{recipe.servings} Servings</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setModalOpen(false)}>×</button>
            {modalLoading || !selectedRecipe ? (
              <div style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>
            ) : (
              <>
                <div className="modal-header-img">
                  <img src={selectedRecipe.image} alt={selectedRecipe.title} />
                </div>
                <div className="modal-body">
                  <h2 className="modal-main-title">{selectedRecipe.title}</h2>
                  <div className="modal-stats">
                    <div className="stat-block">
                      <span className="stat-label">Prep Time</span>
                      <span className="stat-value">{selectedRecipe.readyInMinutes} Mins</span>
                    </div>
                    <div className="stat-block">
                      <span className="stat-label">Servings</span>
                      <span className="stat-value">{selectedRecipe.servings}</span>
                    </div>
                  </div>
                  <div className="modal-inner-grid">
                    <div>
                      <h3>Ingredients</h3>
                      <ul className="ingredients-list">
                        {selectedRecipe.extendedIngredients?.map((ing, k) => (
                          <li key={k}>{ing.original}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3>Instructions</h3>
                      <div className="instructions-text" dangerouslySetInnerHTML={{ __html: selectedRecipe.instructions }} />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Category;
