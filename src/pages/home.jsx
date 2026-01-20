import React, { useState, useEffect } from 'react';
import '../style/home.css';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';
import ApiErrorUI from '../components/ApiErrorUI.jsx';

const API_KEY = 'd5dc6a6d47af468fa68072cc1f0700b9';

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [apiError, setApiError] = useState(null); // 'limit', 'server', or null

  useEffect(() => {
    fetchInitialRecipes();
  }, []);

  const fetchInitialRecipes = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await fetch(`https://api.spoonacular.com/recipes/random?number=20&apiKey=${API_KEY}`);
      if (res.status === 402 || res.status === 429) {
        setApiError('limit');
        return;
      }
      if (!res.ok) {
        setApiError('server');
        return;
      }
      const data = await res.json();
      setRecipes(data.recipes || []);
      setFilteredRecipes(data.recipes || []);
    } catch (err) {
      console.error(err);
      setApiError('server');
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
      const res = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${search}&number=20&addRecipeInformation=true&apiKey=${API_KEY}`);
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
      setFilteredRecipes(data.results || []);
      // Scroll to grid
      const filterBar = document.querySelector('.filters-bar');
      if (filterBar) filterBar.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setApiError('server');
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

  const closeModal = () => {
    setModalOpen(false);
    setSelectedRecipe(null);
  };

  return (
    <div className="page-wrapper">
      <Header />

      {/* LUXURY HERO */}
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

      {/* FILTER BAR */}
      <div className="filters-bar">
        <div className="main-container">
          <div className="filter-pills">
            {['All', 'Healthy', 'Quick', 'Veg'].map(pill => (
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

      {/* RECIPE GRID */}
      <div className="main-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0', fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-muted)' }}>
            Searching for culinary magic...
          </div>
        ) : apiError ? (
          <ApiErrorUI type={apiError} />
        ) : (
          <div className="recipe-grid">
            {filteredRecipes.map(recipe => (
              <div key={recipe.id} className="recipe-card" onClick={() => openModal(recipe.id)}>
                <div className="card-img-wrapper">
                  <img src={recipe.image} alt={recipe.title} className="card-img" />
                  <div className="card-overlay">
                    <span className="card-time">{recipe.readyInMinutes} MINS</span>
                  </div>
                  {recipe.veryHealthy && <span className="card-badge">Healthy Choice</span>}
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
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>×</button>

            {modalLoading || !selectedRecipe ? (
              <div style={{ padding: '100px', textAlign: 'center' }}>Loading ingredients...</div>
            ) : (
              <>
                <div className="modal-header-img">
                  <img src={selectedRecipe.image} alt={selectedRecipe.title} />
                </div>
                <div className="modal-body">
                  <span className="modal-tag">Featured Recipe</span>
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
                    <div className="stat-block">
                      <span className="stat-label">Health Score</span>
                      <span className="stat-value">{selectedRecipe.healthScore}%</span>
                    </div>
                  </div>

                  <div className="modal-inner-grid">
                    <div className="ingredients-sec">
                      <h3 style={{ marginBottom: '20px' }}>Ingredients</h3>
                      <ul className="ingredients-list">
                        {selectedRecipe.extendedIngredients?.map((ing, k) => (
                          <li key={k}>{ing.original}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="instructions-sec">
                      <h3 style={{ marginBottom: '20px' }}>Cooking Guide</h3>
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

export default Home;