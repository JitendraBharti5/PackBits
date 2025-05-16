import Option from '../model/option.model.js';

export const getOptions = async (req, res) => {
  try {
    const options = await Option.find({});
    const grouped = options.reduce((acc, curr) => {
      acc[curr.type] = acc[curr.type] || [];
      acc[curr.type].push(curr.name);
      return acc;
    }, {});
    res.status(200).json(grouped);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch options' });
  }
};
