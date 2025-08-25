import { useCallback, useMemo } from 'react';

export default function useInventory(character, setCharacter) {
  const totalArmor = useMemo(() => {
    const baseArmor = character.armor || 0;
    const equippedArmor = character.inventory
      .filter((item) => item.equipped && item.armor)
      .reduce((total, item) => total + (item.armor || 0), 0);
    return baseArmor + equippedArmor;
  }, [character.inventory, character.armor]);

  const totalWeight = useMemo(() => {
    return character.inventory.reduce((sum, item) => {
      if (typeof item.weight === 'number') {
        return sum + item.weight * (item.quantity || 1);
      }
      if (item.type === 'material' || item.type === 'consumable') {
        return sum + Math.max(0, item.quantity || 0);
      }
      if (item.type === 'armor') return sum + 2;
      return sum + 1;
    }, 0);
  }, [character.inventory]);

  const equippedWeaponDamage = useMemo(() => {
    const weapon = character.inventory.find((item) => item.equipped && item.type === 'weapon');
    return weapon ? weapon.damage || 'd6' : 'd6';
  }, [character.inventory]);

  const handleAddItem = useCallback(
    (newItem) => {
      const id =
        newItem.id ||
        (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : Date.now().toString());
      const itemWithDefaults = {
        ...newItem,
        id,
        notes: newItem.notes || '',
        addedAt: newItem.addedAt || new Date().toISOString(),
      };
      setCharacter((prev) => ({
        ...prev,
        inventory: [...prev.inventory, itemWithDefaults],
      }));
    },
    [setCharacter],
  );

  const handleEquipItem = useCallback(
    (id) => {
      setCharacter((prev) => {
        const itemToEquip = prev.inventory.find((i) => i.id === id);
        const slot = itemToEquip?.slot;
        const isTwoHanded = itemToEquip?.tags?.includes('two-handed');
        return {
          ...prev,
          inventory: prev.inventory.map((item) => {
            if (item.id === id) {
              return { ...item, equipped: !item.equipped };
            }
            if (slot && item.slot === slot && item.equipped) {
              return { ...item, equipped: false };
            }
            if (isTwoHanded && item.slot === 'Off-hand' && item.equipped) {
              return { ...item, equipped: false };
            }
            if (
              itemToEquip?.slot === 'Off-hand' &&
              isTwoHanded &&
              item.slot === 'Weapon' &&
              item.equipped
            ) {
              return { ...item, equipped: false };
            }
            return item;
          }),
        };
      });
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

  const handleUpdateNotes = useCallback(
    (id, notes) => {
      setCharacter((prev) => ({
        ...prev,
        inventory: prev.inventory.map((item) => (item.id === id ? { ...item, notes } : item)),
      }));
    },
    [setCharacter],
  );

  const maxLoad = (character.baseLoad || 0) + (character.stats?.STR?.mod || 0);

  return {
    totalArmor,
    totalWeight,
    equippedWeaponDamage,
    maxLoad,
    handleAddItem,
    handleEquipItem,
    handleConsumeItem,
    handleDropItem,
    handleUpdateNotes,
  };
}
