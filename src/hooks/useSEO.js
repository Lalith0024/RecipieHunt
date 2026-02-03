import { useEffect } from 'react';

const useSEO = (title, description) => {
  useEffect(() => {
    if (title) {
      document.title = `${title} | RecipeHunt`;
    }

    if (description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", description);
      } else {
        const meta = document.createElement('meta');
        meta.name = "description";
        meta.content = description;
        document.head.appendChild(meta);
      }
    }
  }, [title, description]);
};

export default useSEO;
