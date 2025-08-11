import { useCallback } from 'react';

export default function useInventory(character, setCharacter) {
  const getTotalArmor = useCallback(() => {
    const baseArmor = character.armor || 0;
    const equippedArmor = character.inventory
      .filter((item) => item.equipped && item.armor)
      .reduce((total, item) => total + (item.armor || 0), 0);
    return baseArmor + equippedArmor;
  }, [character]);

  const getEquippedWeaponDamage = useCallback(() => {
    const weapon = character.inventory.find((item) => item.equipped && item.type === 'weapon');
    return weapon ? weapon.damage || 'd6' : 'd6';
  }, [character]);

  const handleEquipItem = useCallback(
    (id) => {
      setCharacter((prev) => ({
        ...prev,
        inventory: prev.inventory.map((item) =>
          item.id === id ? { ...item, equipped: !item.equipped } : item,
        ),
      }));
    },
    [setCharacter],
  );

  const handleConsumeItem = useCallback(
    (id, effect) => {
      setCharacter((prev) => {
        const updated = {
          ...prev,
          inventory: prev.inventory.reduce((acc, item) => {
            if (item.id === id) {
              if (item.quantity && item.quantity > 1) {
                acc.push({ ...item, quantity: item.quantity - 1 });
              }
            } else {
              acc.push(item);
            }
            return acc;
          }, []),
        };
        return typeof effect === 'function' ? effect(updated) : updated;
      });
    },
    [setCharacter],
  );

  const handleDropItem = useCallback(
    (id) => {
      setCharacter((prev) => ({
        ...prev,
        inventory: prev.inventory.filter((item) => item.id !== id),
      }));
    },
    [setCharacter],
  );

  return {
    getTotalArmor,
    getEquippedWeaponDamage,
    handleEquipItem,
    handleConsumeItem,
    handleDropItem,
  };
}
