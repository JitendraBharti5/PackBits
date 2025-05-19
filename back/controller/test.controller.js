// import FoodItem from '../model/product.model.js';
// import User from '../model/user.model.js';
// import Ingredient from '../model/ingredient.model.js';

// export const testProductAgainstProfile = async (req, res) => {
//   const { id } = req.params;
//   const { userId, quantity } = req.query;

//   try {
//     const product = await FoodItem.findById(id);
//     const user = await User.findById(userId);

//     if (!product || !user) {
//       return res.status(404).json({ error: 'Product or User not found' });
//     }

//     const ingredientNames = Array.from(product.ingredients_per_100ml.keys());

//     const matched_allergies = [
//       ...new Set([
//         ...product.allergy_info.filter(item => user.allergies.includes(item)),
//         ...ingredientNames.filter(ingredient => user.allergies.includes(ingredient))
//       ])
//     ];

//     const ingredientDocs = await Ingredient.find({ name: { $in: ingredientNames } });

//     const matched_preconditions = [];
//     ingredientDocs.forEach(ingredient => {
//       const restricted = ingredient.restrictedFor || [];
//       restricted.forEach(precondition => {
//         if (user.preconditions.includes(precondition) && !matched_preconditions.includes(precondition)) {
//           matched_preconditions.push(precondition);
//         }
//       });
//     });

//     let veg_match = false;
//     if (user.vegNonVeg === 'veg') {
//       veg_match = product.veg_non_veg === user.vegNonVeg ;
//     } else{
//       veg_match = true;
//     } 

//     res.json({
//       matched_allergies,
//       matched_preconditions,
//       veg_match,
//       selected_quantity: quantity
//     });

//   } catch (err) {
//     console.error('Test error:', err);
//     res.status(500).json({ error: 'Server error during testing' });
//   }
// };
import FoodItem from '../model/product.model.js';
import User from '../model/user.model.js';
import Ingredient from '../model/ingredient.model.js';

export const testProductAgainstProfile = async (req, res) => {
  const { id } = req.params;
  const { userId, quantity } = req.query;

  try {
    const product = await FoodItem.findById(id);
    const user = await User.findById(userId);

    if (!product || !user) {
      return res.status(404).json({ error: 'Product or User not found' });
    }

    // Normalize to lowercase for case-insensitive comparison
    const userAllergies = user.allergies.map(a => a.toLowerCase());
    const userPreconditions = user.preconditions.map(p => p.toLowerCase());

    const ingredientNames = Array.from(product.ingredients_per_100ml.keys());
    const ingredientNamesLower = ingredientNames.map(i => i.toLowerCase());

    const allergyInfoLower = product.allergy_info.map(a => a.toLowerCase());

    const matched_allergies = [
      ...new Set([
        ...allergyInfoLower.filter(item => userAllergies.includes(item)),
        ...ingredientNamesLower.filter(ingredient => userAllergies.includes(ingredient))
      ])
    ];

    const ingredientDocs = await Ingredient.find({
      name: { $in: ingredientNames }
    });

    const matched_preconditions = [];
    ingredientDocs.forEach(ingredient => {
      const restricted = (ingredient.restrictedFor || []).map(r => r.toLowerCase());
      restricted.forEach(precondition => {
        if (
          userPreconditions.includes(precondition) &&
          !matched_preconditions.includes(precondition)
        ) {
          matched_preconditions.push(precondition);
        }
      });
    });

    let veg_match = false;
    if (user.vegNonVeg.toLowerCase() === 'veg') {
      veg_match = product.veg_non_veg.toLowerCase() === 'veg';
    } else {
      veg_match = true; // non-veg users can consume both
    }

    res.json({
      matched_allergies,
      matched_preconditions,
      veg_match,
      selected_quantity: quantity
    });

  } catch (err) {
    console.error('Test error:', err);
    res.status(500).json({ error: 'Server error during testing' });
  }
};
