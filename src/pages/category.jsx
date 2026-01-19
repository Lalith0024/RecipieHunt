import React, { useState, useEffect } from 'react';
import '../style/home.css';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';

const API_KEY = 'd5dc6a6d47af468fa68072cc1f0700b9';

const CATEGORIES = [
  { name: 'Breakfast', img: 'https://cdn-icons-png.flaticon.com/512/706/706918.png' },
  { name: 'Main Course', img: 'https://cdn-icons-png.flaticon.com/512/2718/2718314.png' },
  { name: 'Dessert', img: 'https://cdn-icons-png.flaticon.com/512/10054/10054320.png' },
  { name: 'Appetizer', img: 'https://cdn-icons-png.flaticon.com/512/2550/2550186.png' },
  { name: 'Salad', img: 'https://cdn-icons-png.flaticon.com/512/2153/2153788.png' },
  { name: 'Soup', img: 'https://cdn-icons-png.flaticon.com/512/4359/4359654.png' },
  { name: 'Beverage', img: 'https://cdn-icons-png.flaticon.com/512/3100/3100555.png' },
  { name: 'Snack', img: 'https://cdn-icons-png.flaticon.com/512/2252/2252258.png' },
];

function Category() {
  const [category, setCategory] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    if (category) {
      fetchRecipes();
    }
  }, [category]);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.spoonacular.com/recipes/complexSearch?type=${category.toLowerCase()}&number=20&addRecipeInformation=true&apiKey=${API_KEY}`);
      const data = await res.json();
      setRecipes(data.results || []);
    } catch (err) {
      console.error(err);
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

      <div style={{ marginTop: '100px' }}>
        <section className="categories-section">
          <div className="main-container">
            <h1 className="hero-title" style={{ color: 'var(--text-main)', fontSize: '3rem', marginBottom: '40px' }}>Explore Cuisines</h1>
            <div className="cat-scroll-wrapper">
              {CATEGORIES.map((cat, i) => (
                <div key={i} className={`cat-item ${category === cat.name ? 'active' : ''}`} onClick={() => setCategory(cat.name)}>
                  <div className="cat-img-box" style={category === cat.name ? { borderColor: 'var(--primary)' } : {}}>
                    <img src={cat.img} alt={cat.name} />
                  </div>
                  <span className="cat-name">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="main-container" style={{ minHeight: '400px', paddingTop: '40px' }}>
          {!category && (
            <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>
              <h2>Choose a category to start your journey</h2>
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>Loading gourmet recipes...</div>
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
        </div>
      </div>

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
