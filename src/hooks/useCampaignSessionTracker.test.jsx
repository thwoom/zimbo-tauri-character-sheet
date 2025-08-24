import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MILESTONE_TYPES, useCampaignSessionTracker } from './useCampaignSessionTracker';

describe('useCampaignSessionTracker', () => {
  let mockCharacter;
  let mockSetCharacter;

  beforeEach(() => {
    mockCharacter = {
      sessions: [],
      campaignNotes: '',
      campaignGoals: [],
      xp: 0,
      level: 1,
      xpNeeded: 8,
      name: 'Test Character',
      class: 'fighter',
    };
    mockSetCharacter = vi.fn();
  });

  it('initializes with empty state', () => {
    const { result } = renderHook(() => useCampaignSessionTracker(mockCharacter, mockSetCharacter));

    expect(result.current.sessions).toEqual([]);
    expect(result.current.currentSession).toBeNull();
    expect(result.current.campaignNotes).toBe('');
    expect(result.current.campaignGoals).toEqual([]);
  });

  it('initializes with existing data', () => {
    const existingCharacter = {
      ...mockCharacter,
      sessions: [{ id: '1', date: '2023-01-01', xpGained: 5 }],
      campaignNotes: 'Test notes',
      campaignGoals: [{ id: '1', title: 'Test Goal', status: 'active' }],
    };

    const { result } = renderHook(() =>
      useCampaignSessionTracker(existingCharacter, mockSetCharacter),
    );

    expect(result.current.sessions).toHaveLength(1);
    expect(result.current.campaignNotes).toBe('Test notes');
    expect(result.current.campaignGoals).toHaveLength(1);
  });

  it('starts a new session', () => {
    const { result } = renderHook(() => useCampaignSessionTracker(mockCharacter, mockSetCharacter));

    act(() => {
      const newSession = result.current.startSession({
        partyMembers: ['Player1', 'Player2'],
        location: 'Tavern',
        weather: 'Sunny',
        mood: 'positive',
      });
    });

    expect(result.current.currentSession).toBeDefined();
    expect(result.current.currentSession.partyMembers).toEqual(['Player1', 'Player2']);
    expect(result.current.currentSession.location).toBe('Tavern');
    expect(result.current.currentSession.weather).toBe('Sunny');
    expect(result.current.currentSession.mood).toBe('positive');
    expect(mockSetCharacter).toHaveBeenCalled();
  });

  it('ends a session with XP gain', () => {
    const { result } = renderHook(() => useCampaignSessionTracker(mockCharacter, mockSetCharacter));

    // Start a session
    act(() => {
      result.current.startSession();
    });

    // End the session
    act(() => {
      result.current.endSession({
        xpGained: 5,
        duration: 120,
        notes: 'Great session!',
        recap: 'We defeated the goblins',
      });
    });

    expect(result.current.currentSession).toBeNull();
    expect(result.current.sessions).toHaveLength(1);
    expect(result.current.sessions[0].xpGained).toBe(5);
    expect(result.current.sessions[0].duration).toBe(120);
    expect(result.current.sessions[0].notes).toBe('Great session!');
    expect(result.current.sessions[0].recap).toBe('We defeated the goblins');
    expect(mockSetCharacter).toHaveBeenCalled();
  });

  it('adds milestones to current session', () => {
    const { result } = renderHook(() => useCampaignSessionTracker(mockCharacter, mockSetCharacter));

    // Start a session
    act(() => {
      result.current.startSession();
    });

    // Add a milestone
    act(() => {
      result.current.addMilestone({
        type: MILESTONE_TYPES.QUEST_COMPLETED,
        title: 'Defeat the Goblin King',
        description: 'We successfully defeated the Goblin King and saved the village',
      });
    });

    expect(result.current.currentSession.milestones).toHaveLength(1);
    expect(result.current.currentSession.milestones[0].title).toBe('Defeat the Goblin King');
    expect(result.current.currentSession.milestones[0].type).toBe(MILESTONE_TYPES.QUEST_COMPLETED);
  });

  it('updates campaign notes', () => {
    const { result } = renderHook(() => useCampaignSessionTracker(mockCharacter, mockSetCharacter));

    act(() => {
      result.current.updateCampaignNotes('New campaign notes');
    });

    expect(result.current.campaignNotes).toBe('New campaign notes');
    expect(mockSetCharacter).toHaveBeenCalled();
  });

  it('adds campaign goals', () => {
    const { result } = renderHook(() => useCampaignSessionTracker(mockCharacter, mockSetCharacter));

    act(() => {
      result.current.addCampaignGoal({
        title: 'Save the Kingdom',
        description: 'Defeat the evil sorcerer threatening the kingdom',
      });
    });

    expect(result.current.campaignGoals).toHaveLength(1);
    expect(result.current.campaignGoals[0].title).toBe('Save the Kingdom');
    expect(result.current.campaignGoals[0].status).toBe('active');
    expect(mockSetCharacter).toHaveBeenCalled();
  });

  it('completes campaign goals', () => {
    const { result } = renderHook(() => useCampaignSessionTracker(mockCharacter, mockSetCharacter));

    // Add a goal
    act(() => {
      result.current.addCampaignGoal({
        title: 'Save the Kingdom',
        description: 'Defeat the evil sorcerer',
      });
    });

    const goalId = result.current.campaignGoals[0].id;

    // Complete the goal
    act(() => {
      result.current.completeCampaignGoal(goalId);
    });

    expect(result.current.campaignGoals[0].status).toBe('completed');
    expect(result.current.campaignGoals[0].completedAt).toBeDefined();
    expect(mockSetCharacter).toHaveBeenCalled();
  });

  it('calculates session statistics correctly', () => {
    const characterWithSessions = {
      ...mockCharacter,
      sessions: [
        { id: '1', date: '2023-01-01', xpGained: 5, duration: 120 },
        { id: '2', date: '2023-01-08', xpGained: 3, duration: 90 },
        { id: '3', date: '2023-01-15', xpGained: 7, duration: 150 },
      ],
    };

    const { result } = renderHook(() =>
      useCampaignSessionTracker(characterWithSessions, mockSetCharacter),
    );

    const stats = result.current.getSessionStats();

    expect(stats.totalSessions).toBe(3);
    expect(stats.totalDuration).toBe(360);
    expect(stats.totalXpGained).toBe(15);
    expect(stats.averageDuration).toBe(120);
    expect(stats.averageXpPerSession).toBe(5);
    expect(stats.longestSession).toBe(150);
    expect(stats.shortestSession).toBe(90);
  });

  it('returns empty stats for no sessions', () => {
    const { result } = renderHook(() => useCampaignSessionTracker(mockCharacter, mockSetCharacter));

    const stats = result.current.getSessionStats();

    expect(stats.totalSessions).toBe(0);
    expect(stats.totalDuration).toBe(0);
    expect(stats.totalXpGained).toBe(0);
    expect(stats.averageDuration).toBe(0);
    expect(stats.averageXpPerSession).toBe(0);
    expect(stats.longestSession).toBe(0);
    expect(stats.shortestSession).toBe(0);
  });

  it('gets recent sessions', () => {
    const characterWithSessions = {
      ...mockCharacter,
      sessions: [
        { id: '1', date: '2023-01-01' },
        { id: '2', date: '2023-01-08' },
        { id: '3', date: '2023-01-15' },
        { id: '4', date: '2023-01-22' },
        { id: '5', date: '2023-01-29' },
        { id: '6', date: '2023-02-05' },
      ],
    };

    const { result } = renderHook(() =>
      useCampaignSessionTracker(characterWithSessions, mockSetCharacter),
    );

    const recentSessions = result.current.getRecentSessions(3);
    expect(recentSessions).toHaveLength(3);
    expect(recentSessions[0].id).toBe('1'); // Most recent first
  });

  it('gets sessions by date range', () => {
    const characterWithSessions = {
      ...mockCharacter,
      sessions: [
        { id: '1', date: '2023-01-01T00:00:00.000Z' },
        { id: '2', date: '2023-01-15T00:00:00.000Z' },
        { id: '3', date: '2023-02-01T00:00:00.000Z' },
        { id: '4', date: '2023-02-15T00:00:00.000Z' },
      ],
    };

    const { result } = renderHook(() =>
      useCampaignSessionTracker(characterWithSessions, mockSetCharacter),
    );

    const startDate = new Date('2023-01-01T00:00:00.000Z');
    const endDate = new Date('2023-01-31T23:59:59.999Z');

    const sessionsInRange = result.current.getSessionsByDateRange(startDate, endDate);
    expect(sessionsInRange).toHaveLength(2);
    expect(sessionsInRange[0].id).toBe('1');
    expect(sessionsInRange[1].id).toBe('2');
  });

  it('exports campaign data', () => {
    const characterWithData = {
      ...mockCharacter,
      sessions: [{ id: '1', date: '2023-01-01', xpGained: 5 }],
      campaignNotes: 'Test notes',
      campaignGoals: [{ id: '1', title: 'Test Goal', status: 'active' }],
    };

    const { result } = renderHook(() =>
      useCampaignSessionTracker(characterWithData, mockSetCharacter),
    );

    const exportedData = result.current.exportCampaignData();

    expect(exportedData.sessions).toHaveLength(1);
    expect(exportedData.campaignNotes).toBe('Test notes');
    expect(exportedData.campaignGoals).toHaveLength(1);
    expect(exportedData.character.name).toBe('Test Character');
    expect(exportedData.exportDate).toBeDefined();
  });

  it('imports campaign data', () => {
    const { result } = renderHook(() => useCampaignSessionTracker(mockCharacter, mockSetCharacter));

    const importData = {
      sessions: [{ id: '1', date: '2023-01-01', xpGained: 5 }],
      campaignNotes: 'Imported notes',
      campaignGoals: [{ id: '1', title: 'Imported Goal', status: 'active' }],
    };

    act(() => {
      result.current.importCampaignData(importData);
    });

    expect(result.current.sessions).toHaveLength(1);
    expect(result.current.campaignNotes).toBe('Imported notes');
    expect(result.current.campaignGoals).toHaveLength(1);
    expect(mockSetCharacter).toHaveBeenCalled();
  });

  it('provides MILESTONE_TYPES constant', () => {
    const { result } = renderHook(() => useCampaignSessionTracker(mockCharacter, mockSetCharacter));

    expect(result.current.MILESTONE_TYPES).toBe(MILESTONE_TYPES);
    expect(MILESTONE_TYPES.QUEST_COMPLETED).toBe('quest_completed');
    expect(MILESTONE_TYPES.LOCATION_DISCOVERED).toBe('location_discovered');
    expect(MILESTONE_TYPES.NPC_MET).toBe('npc_met');
    expect(MILESTONE_TYPES.ITEM_ACQUIRED).toBe('item_acquired');
    expect(MILESTONE_TYPES.BOND_RESOLVED).toBe('bond_resolved');
    expect(MILESTONE_TYPES.LEVEL_UP).toBe('level_up');
    expect(MILESTONE_TYPES.CUSTOM).toBe('custom');
  });

  it('handles null character gracefully', () => {
    const { result } = renderHook(() => useCampaignSessionTracker(null, mockSetCharacter));

    expect(result.current.sessions).toEqual([]);
    expect(result.current.campaignNotes).toBe('');
    expect(result.current.campaignGoals).toEqual([]);
  });

  it('handles missing character properties gracefully', () => {
    const incompleteCharacter = {
      name: 'Test Character',
      level: 1,
      xp: 0,
    };

    const { result } = renderHook(() =>
      useCampaignSessionTracker(incompleteCharacter, mockSetCharacter),
    );

    expect(result.current.sessions).toEqual([]);
    expect(result.current.campaignNotes).toBe('');
    expect(result.current.campaignGoals).toEqual([]);
  });
});
