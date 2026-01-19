import React, { useState, useEffect } from 'react';
import '../style/home.css';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';

const CATEGORIES = [
  { label: 'All', value: '' },
  { label: 'Breakfast', value: 'breakfast' },
  { label: 'Lunch', value: 'lunch' },
  { label: 'Dinner', value: 'dinner' },
  { label: 'Dessert', value: 'dessert' },
  { label: 'Snack', value: 'snack' },
  { label: 'Beverage', value: 'beverage' },
  { label: 'Salad', value: 'salad' },
  { label: 'Soup', value: 'soup' },
  { label: 'Appetizer', value: 'appetizer' },
];

function Category() {
  const [category, setCategory] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, [category]);

  function fetchRecipes() {
    setLoading(true);
    let url = 'https://api.spoonacular.com/recipes/complexSearch?number=12&addRecipeInformation=true&apiKey=d5dc6a6d47af468fa68072cc1f0700b9';
    if (category) {
      url += `&type=${category}`;
    }
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setRecipes(data.results || []);
        setLoading(false);
      });
  }

  function openModal(recipe) {
    if (recipe.extendedIngredients && recipe.instructions) {
      setSelectedRecipe(recipe);
      setModalOpen(true);
      setModalLoading(false);
    } else {
      setModalLoading(true);
      setModalOpen(true);
      fetch(`https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=d5dc6a6d47af468fa68072cc1f0700b9`)
        .then(res => res.json())
        .then(data => {
          setSelectedRecipe(data);
          setModalLoading(false);
        });
    }
  }
  function closeModal() {
    setModalOpen(false);
    setSelectedRecipe(null);
    setModalLoading(false);
  }

  return (
    <>
      <Header />
      <section className="category-section">
        <div className="category-container">
          <h1 className="category-title">Browse by Category</h1>
          <p className="category-subtitle">
            Pick a vibe and discover recipes that match your mood.
          </p>
          <div className="category-filter-group">
            <label htmlFor="category-select" className="category-label">Category:</label>
            <select
              id="category-select"
              className="category-select"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          {loading ? (
            <div className="loading-recipes">Loading recipes...</div>
          ) : (
            <div className="recipe-grid">
              {recipes.map(recipe => (
                <div className="recipe-card" key={recipe.id}>
                  <img src={recipe.image} alt={recipe.title} className="recipe-img" />
                  <div className="recipe-info">
                    <h3 className="recipe-title">{recipe.title}</h3>
                    <div className="recipe-meta">
                      <span>🕒 {recipe.readyInMinutes} min</span>
                      <span>{recipe.servings} servings</span>
                    </div>
                    <div style={{width:'100%'}}>
                      <button className="view-recipe-btn" style={{width:'100%'}} onClick={() => openModal(recipe)}>
                        View Recipe
                      </button>
                    </div>
                    {recipe.dishTypes && recipe.dishTypes.length > 0 && (
                      <span className="recipe-tag">{recipe.dishTypes[0]}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      {modalOpen && (
        <div className="modal-bg" onClick={closeModal}>
          <div className="modal-box" style={{padding:'32px 24px 32px 24px'}} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>&times;</button>
            {modalLoading || !selectedRecipe ? (
              <div className="modal-loading">Loading...</div>
            ) : (
              <>
                <img src={selectedRecipe.image} alt={selectedRecipe.title} className="modal-img" />
                <h2 className="modal-title">{selectedRecipe.title}</h2>
                <div className="modal-meta">
                  <span>🕒 {selectedRecipe.readyInMinutes} min</span>
                  <span>{selectedRecipe.servings} servings</span>
                </div>
                <div className="modal-section">
                  <h3>Ingredients</h3>
                  <ul className="modal-ingredients">
                    {Array.isArray(selectedRecipe.extendedIngredients) && selectedRecipe.extendedIngredients.length > 0 ? (
                      selectedRecipe.extendedIngredients.map((ing, idx) => (
                        <li key={idx}>{ing.original}</li>
                      ))
                    ) : (
                      <li>No ingredients available.</li>
                    )}
                  </ul>
                </div>
                <div className="modal-section">
                  <h3>Instructions</h3>
                  <div className="modal-instructions">
                    {selectedRecipe.instructions ? (
                      <p>{selectedRecipe.instructions.replace(/<[^>]+>/g, '').replace(/\d+\./g, '').replace(/\s+/g, ' ').trim()}</p>
                    ) : selectedRecipe.analyzedInstructions && selectedRecipe.analyzedInstructions.length > 0 ? (
                      <p>{selectedRecipe.analyzedInstructions[0].steps.map((step) => step.step).join(' ')}</p>
                    ) : (
                      <p>No instructions available.</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default Category;
