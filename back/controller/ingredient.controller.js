import ingredients from '../model/ingredient.model.js'

export const getIngredientByName = async (req, res) => {
  try {
    const { name } = req.params;
    // Build a regex that matches the name exactly, ignoring case
    const ingredient = await ingredients.findOne({
      name: new RegExp(`^${name}$`, 'i')
    });

    if (!ingredient) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }

    res.status(200).json(ingredient);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};




export const searchIngredients = async (req, res) => {
  try {
    const name = req.query.name;
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ message: 'Please provide a valid ingredient name to search.' });
    }

    const regex = new RegExp(name, 'i'); // case-insensitive match
    const ingredientss = await ingredients.find({ name: regex }).limit(5).select('name');

    res.status(200).json(ingredientss);
  } catch (error) {
    console.error('Error searching ingredients:', error);
    res.status(500).json({ message: 'Server error while searching for ingredients.' });
  }
};



