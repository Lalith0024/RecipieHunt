import { useState } from 'react';
import { fetchRecipeDetails } from '../services/recipeService';

const useRecipeModal = () => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const openModal = async (recipeId) => {
    setModalOpen(true);
    setModalLoading(true);
    try {
      const data = await fetchRecipeDetails(recipeId);
      setSelectedRecipe(data);
    } catch (err) {
      console.error('Failed to fetch recipe details:', err);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedRecipe(null);
  };

  return {
    selectedRecipe,
    modalOpen,
    modalLoading,
    openModal,
    closeModal
  };
};

export default useRecipeModal;
