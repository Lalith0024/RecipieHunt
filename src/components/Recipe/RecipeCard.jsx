import React from 'react';

const RecipeCard = ({ recipe, onClick }) => {
  return (
    <div className="recipe-card" onClick={() => onClick(recipe.id)}>
      <div className="card-img-wrapper">
        <img src={recipe.image || '/placeholder-recipe.png'} alt={recipe.title} className="card-img" />
        <div className="card-overlay">
          <span className="card-time">{recipe.readyInMinutes || '?'} MINS</span>
        </div>
        {recipe.veryHealthy && <span className="card-badge">Healthy Choice</span>}
      </div>
      <div className="card-info">
        <h3 className="card-title">{recipe.title}</h3>
        <div className="card-meta">
          <span className="rating-star">★ {((recipe.healthScore || 0) / 20).toFixed(1)}</span>
          <span>•</span>
          <span>{recipe.servings || 0} Servings</span>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
