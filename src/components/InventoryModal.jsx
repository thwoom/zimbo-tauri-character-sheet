import PropTypes from 'prop-types';
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { durations, easings, fadeScale } from '../motion/tokens';
import { useMotionTransition, useMotionVariants } from '../motion/reduced';
import Panel from './ui/Panel';
import Card from './ui/Card';
import Toolbar from './ui/Toolbar';
import { inventoryItemType } from './common/inventoryItemPropTypes.js';

const InventoryModal = ({
  isOpen = true,
  inventory,
  onEquip,
  onConsume,
  onDrop,
  onUpdateNotes = () => {},
  onClose,
}) => {
  const transition = useMotionTransition(durations.md, easings.standard);
  const variants = useMotionVariants(fadeScale);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 z-modal flex items-center justify-center p-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
        >
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={transition}
          >
            <Panel className="w-full max-w-lg max-h-[80vh] overflow-y-auto">
              <h2 className="text-accent text-center mb-md">🎒 Inventory</h2>

              {inventory.length === 0 ? (
                <p className="text-muted-foreground">No items</p>
              ) : (
                <ul className="list-none p-0 m-0 flex flex-col gap-md">
                  {inventory.map((item) => (
                    <li key={item.id}>
                      <Card className="mb-md last:mb-0">
                        <div className="font-bold relative group">
                          {item.name}
                          {item.quantity ? ` x${item.quantity}` : ''}
                          {item.description && (
                            <div className="absolute hidden group-hover:block bg-muted text-fg px-sm py-1 rounded top-full left-0 text-xs w-max max-w-xs z-overlay">
                              {item.description}
                            </div>
                          )}
                        </div>
                        <div className="mt-sm text-muted text-xs">
                          {item.addedAt && (
                            <div className="mb-sm">
                              Added {new Date(item.addedAt).toLocaleDateString()}
                            </div>
                          )}
                          <textarea
                            className="w-full mt-sm bg-muted border border-muted rounded text-fg p-sm resize-y"
                            placeholder="Notes"
                            value={item.notes || ''}
                            onChange={(e) => onUpdateNotes(item.id, e.target.value)}
                          />
                        </div>
                        <Toolbar className="mt-md justify-center flex-wrap w-full">
                          {'equipped' in item && (
                            <button
                              className="flex-1 basis-[150px] rounded-sm bg-accent text-fg px-sm py-1"
                              onClick={() => onEquip(item.id)}
                              data-testid="equip-toggle"
                            >
                              {item.equipped ? 'Unequip' : 'Equip'}
                            </button>
                          )}
                          {item.type === 'consumable' && (
                            <button
                              className="flex-1 basis-[150px] rounded-sm bg-accent text-fg px-sm py-1"
                              onClick={() => onConsume(item.id)}
                            >
                              Consume
                            </button>
                          )}
                          <button
                            className="flex-1 basis-[150px] rounded-sm bg-accent text-fg px-sm py-1"
                            onClick={() => onDrop(item.id)}
                          >
                            Drop
                          </button>
                        </Toolbar>
                      </Card>
                    </li>
                  ))}
                </ul>
              )}
              <div className="text-center mt-md">
                <button
                  className="rounded-sm bg-accent text-fg px-sm py-1"
                  onClick={onClose}
                  data-testid="close-inventory"
                >
                  Close
                </button>
              </div>
            </Panel>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

InventoryModal.propTypes = {
  isOpen: PropTypes.bool,
  inventory: PropTypes.arrayOf(inventoryItemType).isRequired,
  onEquip: PropTypes.func.isRequired,
  onConsume: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  onUpdateNotes: PropTypes.func,
  onClose: PropTypes.func.isRequired,
};

export default InventoryModal;
