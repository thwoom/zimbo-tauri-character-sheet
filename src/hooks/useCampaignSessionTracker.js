import { useState, useEffect, useCallback } from 'react';

// Session milestone types for tracking campaign progress
export const MILESTONE_TYPES = {
  QUEST_COMPLETED: 'quest_completed',
  LOCATION_DISCOVERED: 'location_discovered',
  NPC_MET: 'npc_met',
  ITEM_ACQUIRED: 'item_acquired',
  BOND_RESOLVED: 'bond_resolved',
  LEVEL_UP: 'level_up',
  CUSTOM: 'custom',
};

// Default session template
const DEFAULT_SESSION_TEMPLATE = {
  id: null,
  date: new Date().toISOString(),
  duration: 0, // in minutes
  xpGained: 0,
  notes: '',
  recap: '',
  milestones: [],
  partyMembers: [],
  location: '',
  weather: '',
  mood: 'neutral', // positive, neutral, negative
  highlights: [],
  challenges: [],
  nextSession: {
    plannedDate: null,
    goals: [],
    preparation: '',
  },
};

export const useCampaignSessionTracker = (character, setCharacter) => {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [campaignNotes, setCampaignNotes] = useState('');
  const [campaignGoals, setCampaignGoals] = useState([]);

  // Initialize sessions from character data
  useEffect(() => {
    if (character?.sessions) {
      setSessions(character.sessions);
    }
    if (character?.campaignNotes) {
      setCampaignNotes(character.campaignNotes);
    }
    if (character?.campaignGoals) {
      setCampaignGoals(character.campaignGoals);
    }
  }, [character?.sessions, character?.campaignNotes, character?.campaignGoals]);

  // Start a new session
  const startSession = useCallback((sessionData = {}) => {
    const newSession = {
      ...DEFAULT_SESSION_TEMPLATE,
      ...sessionData,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };

    setCurrentSession(newSession);
    
    // Update character with session start
    setCharacter((prev) => ({
      ...prev,
      currentSession: newSession,
      lastSessionStart: new Date().toISOString(),
    }));

    return newSession;
  }, [setCharacter]);

  // End the current session
  const endSession = useCallback((sessionData) => {
    if (!currentSession) return null;

    const endedSession = {
      ...currentSession,
      ...sessionData,
      endDate: new Date().toISOString(),
      duration: sessionData.duration || 0,
    };

    // Add XP if gained
    if (sessionData.xpGained > 0) {
      setCharacter((prev) => ({
        ...prev,
        xp: prev.xp + sessionData.xpGained,
        xpNeeded: prev.level + 7,
      }));
    }

    // Save session to history
    const updatedSessions = [endedSession, ...sessions];
    setSessions(updatedSessions);

    // Update character data
    setCharacter((prev) => ({
      ...prev,
      sessions: updatedSessions,
      currentSession: null,
      lastSessionEnd: new Date().toISOString(),
      sessionRecap: sessionData.recap || '',
      sessionNotes: sessionData.notes || '',
      actionHistory: [
        { 
          action: 'End Session', 
          state: structuredClone(prev), 
          timestamp: Date.now(),
          sessionData: endedSession,
        },
        ...prev.actionHistory.slice(0, 4),
      ],
    }));

    setCurrentSession(null);
    return endedSession;
  }, [currentSession, sessions, setCharacter]);

  // Add a milestone to the current session
  const addMilestone = useCallback((milestone) => {
    if (!currentSession) return;

    const newMilestone = {
      id: Date.now().toString(),
      type: milestone.type || MILESTONE_TYPES.CUSTOM,
      title: milestone.title,
      description: milestone.description,
      timestamp: new Date().toISOString(),
      ...milestone,
    };

    const updatedSession = {
      ...currentSession,
      milestones: [...currentSession.milestones, newMilestone],
    };

    setCurrentSession(updatedSession);
    
    // Update character's current session
    setCharacter((prev) => ({
      ...prev,
      currentSession: updatedSession,
    }));

    return newMilestone;
  }, [currentSession, setCharacter]);

  // Update campaign notes
  const updateCampaignNotes = useCallback((notes) => {
    setCampaignNotes(notes);
    setCharacter((prev) => ({
      ...prev,
      campaignNotes: notes,
    }));
  }, [setCharacter]);

  // Add campaign goal
  const addCampaignGoal = useCallback((goal) => {
    const newGoal = {
      id: Date.now().toString(),
      title: goal.title,
      description: goal.description,
      status: 'active', // active, completed, abandoned
      createdAt: new Date().toISOString(),
      completedAt: null,
      ...goal,
    };

    const updatedGoals = [...campaignGoals, newGoal];
    setCampaignGoals(updatedGoals);
    
    setCharacter((prev) => ({
      ...prev,
      campaignGoals: updatedGoals,
    }));

    return newGoal;
  }, [campaignGoals, setCharacter]);

  // Complete a campaign goal
  const completeCampaignGoal = useCallback((goalId) => {
    const updatedGoals = campaignGoals.map((goal) =>
      goal.id === goalId
        ? { ...goal, status: 'completed', completedAt: new Date().toISOString() }
        : goal
    );

    setCampaignGoals(updatedGoals);
    setCharacter((prev) => ({
      ...prev,
      campaignGoals: updatedGoals,
    }));
  }, [campaignGoals, setCharacter]);

  // Get session statistics
  const getSessionStats = useCallback(() => {
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        totalDuration: 0,
        totalXpGained: 0,
        averageDuration: 0,
        averageXpPerSession: 0,
        longestSession: 0,
        shortestSession: 0,
      };
    }

    const totalSessions = sessions.length;
    const totalDuration = sessions.reduce((sum, session) => sum + (session.duration || 0), 0);
    const totalXpGained = sessions.reduce((sum, session) => sum + (session.xpGained || 0), 0);
    const averageDuration = Math.round(totalDuration / totalSessions);
    const averageXpPerSession = Math.round((totalXpGained / totalSessions) * 10) / 10;
    const longestSession = Math.max(...sessions.map(s => s.duration || 0));
    const shortestSession = Math.min(...sessions.map(s => s.duration || 0));

    return {
      totalSessions,
      totalDuration,
      totalXpGained,
      averageDuration,
      averageXpPerSession,
      longestSession,
      shortestSession,
    };
  }, [sessions]);

  // Get recent sessions
  const getRecentSessions = useCallback((count = 5) => {
    return sessions.slice(0, count);
  }, [sessions]);

  // Get sessions by date range
  const getSessionsByDateRange = useCallback((startDate, endDate) => {
    return sessions.filter((session) => {
      const sessionDate = new Date(session.date);
      return sessionDate >= startDate && sessionDate <= endDate;
    });
  }, [sessions]);

  // Export campaign data
  const exportCampaignData = useCallback(() => {
    return {
      sessions,
      campaignNotes,
      campaignGoals,
      character: {
        name: character.name,
        level: character.level,
        xp: character.xp,
        class: character.class,
      },
      exportDate: new Date().toISOString(),
    };
  }, [sessions, campaignNotes, campaignGoals, character]);

  // Import campaign data
  const importCampaignData = useCallback((data) => {
    if (data.sessions) {
      setSessions(data.sessions);
      setCharacter((prev) => ({
        ...prev,
        sessions: data.sessions,
      }));
    }
    
    if (data.campaignNotes) {
      setCampaignNotes(data.campaignNotes);
      setCharacter((prev) => ({
        ...prev,
        campaignNotes: data.campaignNotes,
      }));
    }
    
    if (data.campaignGoals) {
      setCampaignGoals(data.campaignGoals);
      setCharacter((prev) => ({
        ...prev,
        campaignGoals: data.campaignGoals,
      }));
    }
  }, [setCharacter]);

  return {
    // State
    sessions,
    currentSession,
    campaignNotes,
    campaignGoals,
    
    // Session management
    startSession,
    endSession,
    addMilestone,
    
    // Campaign management
    updateCampaignNotes,
    addCampaignGoal,
    completeCampaignGoal,
    
    // Analytics
    getSessionStats,
    getRecentSessions,
    getSessionsByDateRange,
    
    // Import/Export
    exportCampaignData,
    importCampaignData,
    
    // Constants
    MILESTONE_TYPES,
  };
};
