import PropTypes from 'prop-types';

export const inventoryItemType = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  slot: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  weight: PropTypes.number,
  magical: PropTypes.bool,
  quantity: PropTypes.number,
  description: PropTypes.string,
  equipped: PropTypes.bool,
  damage: PropTypes.string,
  armor: PropTypes.number,
  addedAt: PropTypes.string,
  notes: PropTypes.string,
  effects: PropTypes.string,
});

export default inventoryItemType;
