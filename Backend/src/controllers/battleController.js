import Battle from '../models/Battle.js';

export const getBattle = async (req, res) => {
  try {
    const battle = await Battle.findOne().populate('product1').populate('product2');
    res.json(battle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBattle = async (req, res) => {
  const { product1Id, product2Id } = req.body;
  try {
    let battle = await Battle.findOne();
    if (battle) {
      battle.product1 = product1Id;
      battle.product2 = product2Id;
      await battle.save();
    } else {
      battle = await Battle.create({ product1: product1Id, product2: product2Id });
    }
    const populated = await battle.populate(['product1', 'product2']);
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
