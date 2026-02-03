import React from 'react';

const RecipeModal = ({ isOpen, isLoading, recipe, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>×</button>

        {isLoading || !recipe ? (
          <div style={{ padding: '100px', textAlign: 'center' }}>
            <div className="loader">Searching for culinary magic...</div>
          </div>
        ) : (
          <>
            <div className="modal-header-img">
              <img src={recipe.image} alt={recipe.title} />
            </div>
            <div className="modal-body">
              <span className="modal-tag">Featured Recipe</span>
              <h2 className="modal-main-title">{recipe.title}</h2>

              <div className="modal-stats">
                <div className="stat-block">
                  <span className="stat-label">Prep Time</span>
                  <span className="stat-value">{recipe.readyInMinutes} Mins</span>
                </div>
                <div className="stat-block">
                  <span className="stat-label">Servings</span>
                  <span className="stat-value">{recipe.servings}</span>
                </div>
                <div className="stat-block">
                  <span className="stat-label">Health Score</span>
                  <span className="stat-value">{recipe.healthScore}%</span>
                </div>
              </div>

              <div className="modal-inner-grid">
                <div className="ingredients-sec">
                  <h3 style={{ marginBottom: '20px' }}>Ingredients</h3>
                  <ul className="ingredients-list">
                    {recipe.extendedIngredients?.map((ing, k) => (
                      <li key={k}>{ing.original}</li>
                    ))}
                  </ul>
                </div>
                <div className="instructions-sec">
                  <h3 style={{ marginBottom: '20px' }}>Cooking Guide</h3>
                  <div
                    className="instructions-text"
                    dangerouslySetInnerHTML={{ __html: recipe.instructions || 'No instructions provided.' }}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecipeModal;
