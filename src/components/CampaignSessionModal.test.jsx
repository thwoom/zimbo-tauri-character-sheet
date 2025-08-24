import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CharacterProvider } from '../state/CharacterContext';
import CampaignSessionModal from './CampaignSessionModal';

// Mock the useCampaignSessionTracker hook
vi.mock('../hooks/useCampaignSessionTracker', () => ({
  useCampaignSessionTracker: () => ({
    sessions: [
      {
        id: '1',
        date: '2023-01-01T00:00:00.000Z',
        xpGained: 5,
        duration: 120,
        location: 'Tavern',
        mood: 'positive',
        milestones: [{ id: '1', title: 'Defeat Goblin', type: 'quest_completed' }],
      },
    ],
    currentSession: null,
    campaignNotes: 'Test campaign notes',
    campaignGoals: [
      {
        id: '1',
        title: 'Save the Kingdom',
        description: 'Defeat the evil sorcerer',
        status: 'active',
      },
    ],
    startSession: vi.fn(),
    endSession: vi.fn(),
    addMilestone: vi.fn(),
    updateCampaignNotes: vi.fn(),
    addCampaignGoal: vi.fn(),
    completeCampaignGoal: vi.fn(),
    getSessionStats: () => ({
      totalSessions: 1,
      totalDuration: 120,
      totalXpGained: 5,
      averageDuration: 120,
      averageXpPerSession: 5,
      longestSession: 120,
      shortestSession: 120,
    }),
    getRecentSessions: () => [
      {
        id: '1',
        date: '2023-01-01T00:00:00.000Z',
        xpGained: 5,
        duration: 120,
        location: 'Tavern',
        mood: 'positive',
        milestones: [{ id: '1', title: 'Defeat Goblin', type: 'quest_completed' }],
      },
    ],
    exportCampaignData: vi.fn(),
    importCampaignData: vi.fn(),
    MILESTONE_TYPES: {
      QUEST_COMPLETED: 'quest_completed',
      LOCATION_DISCOVERED: 'location_discovered',
      NPC_MET: 'npc_met',
      ITEM_ACQUIRED: 'item_acquired',
      BOND_RESOLVED: 'bond_resolved',
      LEVEL_UP: 'level_up',
      CUSTOM: 'custom',
    },
  }),
}));

const renderWithCharacter = (component) => {
  return render(<CharacterProvider>{component}</CharacterProvider>);
};

describe('CampaignSessionModal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders when open', () => {
    renderWithCharacter(<CampaignSessionModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('Campaign Session Tracker')).toBeInTheDocument();
    expect(
      screen.getByText('Manage your campaign sessions, track progress, and plan ahead'),
    ).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    renderWithCharacter(<CampaignSessionModal isOpen={false} onClose={mockOnClose} />);

    expect(screen.queryByText('Campaign Session Tracker')).not.toBeInTheDocument();
  });

  it('displays overview tab by default', () => {
    renderWithCharacter(<CampaignSessionModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Sessions')).toBeInTheDocument();
    expect(screen.getByText('Campaign Notes')).toBeInTheDocument();
    expect(screen.getByText('Campaign Goals')).toBeInTheDocument();
  });

  it('shows session statistics', () => {
    renderWithCharacter(<CampaignSessionModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('1')).toBeInTheDocument(); // Total Sessions
    expect(screen.getByText('2h 0m')).toBeInTheDocument(); // Total Play Time
    expect(screen.getByText('5')).toBeInTheDocument(); // Total XP Gained
    expect(screen.getByText('5')).toBeInTheDocument(); // Avg XP/Session
    expect(screen.getByText('2h 0m')).toBeInTheDocument(); // Avg Session Length
    expect(screen.getByText('1')).toBeInTheDocument(); // Active Goals
  });

  it('shows start new session button when no current session', () => {
    renderWithCharacter(<CampaignSessionModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('Start New Session')).toBeInTheDocument();
  });

  it('switches to sessions tab', async () => {
    const user = userEvent.setup();
    renderWithCharacter(<CampaignSessionModal isOpen={true} onClose={mockOnClose} />);

    await user.click(screen.getByText('Sessions'));

    // Should show session data
    expect(screen.getByText('Jan 1, 2023')).toBeInTheDocument();
    expect(screen.getByText('+5 XP')).toBeInTheDocument();
    expect(screen.getByText('Tavern')).toBeInTheDocument();
  });

  it('switches to campaign notes tab', async () => {
    const user = userEvent.setup();
    renderWithCharacter(<CampaignSessionModal isOpen={true} onClose={mockOnClose} />);

    await user.click(screen.getByText('Campaign Notes'));

    expect(screen.getByDisplayValue('Test campaign notes')).toBeInTheDocument();
  });

  it('switches to campaign goals tab', async () => {
    const user = userEvent.setup();
    renderWithCharacter(<CampaignSessionModal isOpen={true} onClose={mockOnClose} />);

    await user.click(screen.getByText('Campaign Goals'));

    expect(screen.getByText('Save the Kingdom')).toBeInTheDocument();
    expect(screen.getByText('Defeat the evil sorcerer')).toBeInTheDocument();
    expect(screen.getByText('active')).toBeInTheDocument();
  });

  it('closes modal when close button is clicked', async () => {
    const user = userEvent.setup();
    renderWithCharacter(<CampaignSessionModal isOpen={true} onClose={mockOnClose} />);

    await user.click(screen.getByLabelText('Close modal'));

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('closes modal when close button is clicked', async () => {
    const user = userEvent.setup();
    renderWithCharacter(<CampaignSessionModal isOpen={true} onClose={mockOnClose} />);

    await user.click(screen.getByLabelText('Close modal'));

    expect(mockOnClose).toHaveBeenCalled();
  });
});
