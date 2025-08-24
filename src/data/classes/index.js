import { barbarian } from './barbarian';
import { bard } from './bard';
import { cleric } from './cleric';
import { druid } from './druid';
import { fighter } from './fighter';
import { immolator } from './immolator';
import { paladin } from './paladin';
import { ranger } from './ranger';
import { thief } from './thief';
import { wizard } from './wizard';

export const classes = {
  fighter,
  thief,
  wizard,
  cleric,
  ranger,
  paladin,
  druid,
  bard,
  barbarian,
  immolator,
};

export const classList = Object.keys(classes);

// Helper function to get class by name
export const getClass = (className) => classes[className];

// Helper function to get all class names
export const getClassNames = () => classList;

// Helper function to get class template (starting character)
export const getClassTemplate = (className) => {
  const classData = classes[className];
  if (!classData) return null;

  return {
    ...classData.template,
    class: className,
    className: classData.name,
  };
};

// Helper function to get all available moves for a class at a given level
export const getAvailableMoves = (className, level) => {
  const classData = classes[className];
  if (!classData) return [];

  const availableMoves = [...classData.startingMoves];

  // Add advanced moves based on level
  classData.advancedMoves.forEach((move) => {
    if (move.level <= level) {
      availableMoves.push(move);
    }
  });

  return availableMoves;
};

// Helper function to get moves that can be selected at a given level
export const getSelectableMoves = (className, level, selectedMoves = []) => {
  const classData = classes[className];
  if (!classData) return [];

  const selectableMoves = [];

  // Add advanced moves that can be selected
  classData.advancedMoves.forEach((move) => {
    if (move.level <= level && !selectedMoves.includes(move.id)) {
      selectableMoves.push(move);
    }
  });

  return selectableMoves;
};
