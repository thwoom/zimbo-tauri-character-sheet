import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import ClassMechanicsModal from './ClassMechanicsModal';

// Mock the class data
vi.mock('../data/classes', () => ({
  getClass: vi.fn((className) => {
    const mockClasses = {
      wizard: {
        name: 'Wizard',
        description: 'A master of arcane magic.',
        startingMoves: [
          {
            id: 'cast_spell',
            name: 'Cast a Spell',
            description: 'Cast a spell from your spellbook.',
          },
        ],
        advancedMoves: [
          {
            id: 'ritual',
            name: 'Ritual',
            description: 'Perform a ritual to cast a spell.',
            level: 2,
          },
        ],
        mechanics: {
          spellSlots: { 1: 3, 2: 4 },
          cantrips: ['Light', 'Mage Hand'],
          startingSpells: ['Magic Missile', 'Fireball'],
        },
      },
      ranger: {
        name: 'Ranger',
        description: 'A wilderness warrior and tracker.',
        startingMoves: [
          { id: 'hunt_and_track', name: 'Hunt and Track', description: 'Follow a trail of clues.' },
        ],
        advancedMoves: [],
        mechanics: {
          companionOptions: {
            species: ['Wolf', 'Hawk'],
            strengths: ['Ferocious', 'Swift'],
            training: ['Hunt', 'Guard'],
          },
        },
      },
    };
    return mockClasses[className] || null;
  }),
}));

const mockCharacter = {
  class: 'wizard',
  name: 'Test Wizard',
  level: 1,
  animalCompanion: {
    name: '',
    species: '',
    strengths: [],
    training: [],
  },
  deity: {
    name: '',
    domain: '',
    precept: '',
  },
  oath: {
    tenets: [],
    quest: '',
  },
  prayerbook: {
    prepared: [],
    known: [],
    castToday: [],
  },
};

const mockSetCharacter = vi.fn();

const renderComponent = (props = {}) => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    character: mockCharacter,
    setCharacter: mockSetCharacter,
    ...props,
  };
  return render(<ClassMechanicsModal {...defaultProps} />);
};

describe('ClassMechanicsModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders when open', () => {
    renderComponent();
    expect(screen.getByText('Wizard Mechanics')).toBeInTheDocument();
    expect(
      screen.getByText('Manage your class-specific abilities and resources'),
    ).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    renderComponent({ isOpen: false });
    expect(screen.queryByText('Wizard Mechanics')).not.toBeInTheDocument();
  });

  it('shows overview tab by default', () => {
    renderComponent();
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Class Mechanics')).toBeInTheDocument();
    expect(screen.getByText('A master of arcane magic.')).toBeInTheDocument();
  });

  it('switches to mechanics tab when clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    const mechanicsTab = screen.getByText('Class Mechanics');
    await user.click(mechanicsTab);

    expect(screen.getByText('Spellbook')).toBeInTheDocument();
    expect(screen.getByText('Spell Slots')).toBeInTheDocument();
  });

  it('displays wizard spell mechanics correctly', async () => {
    const user = userEvent.setup();
    renderComponent();

    const mechanicsTab = screen.getByText('Class Mechanics');
    await user.click(mechanicsTab);

    expect(screen.getByText('Level 1')).toBeInTheDocument();
    expect(screen.getByText('3 slots')).toBeInTheDocument();
    expect(screen.getByText('Level 2')).toBeInTheDocument();
    expect(screen.getByText('4 slots')).toBeInTheDocument();
    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Mage Hand')).toBeInTheDocument();
  });

  it('displays ranger companion mechanics correctly', async () => {
    const user = userEvent.setup();
    renderComponent({ character: { ...mockCharacter, class: 'ranger' } });

    const mechanicsTab = screen.getByText('Class Mechanics');
    await user.click(mechanicsTab);

    expect(screen.getByText('Animal Companion')).toBeInTheDocument();
    expect(screen.getByText('Companion Name')).toBeInTheDocument();
    expect(screen.getByText('Species')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderComponent({ onClose });

    const closeButton = screen.getByLabelText('Close modal');
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderComponent({ onClose });

    const backdrop = screen.getByLabelText('Close modal backdrop');
    await user.click(backdrop);

    expect(onClose).toHaveBeenCalled();
  });

  it('shows starting moves in overview', () => {
    renderComponent();
    expect(screen.getByText('Starting Moves')).toBeInTheDocument();
    expect(screen.getByText('Cast a Spell')).toBeInTheDocument();
    expect(screen.getByText('Cast a spell from your spellbook.')).toBeInTheDocument();
  });

  it('shows advanced moves in overview', () => {
    renderComponent();
    expect(screen.getByText('Advanced Moves Available')).toBeInTheDocument();
    expect(screen.getByText('Ritual')).toBeInTheDocument();
    expect(screen.getByText('(Level 2)')).toBeInTheDocument();
    expect(screen.getByText('Perform a ritual to cast a spell.')).toBeInTheDocument();
  });
});
