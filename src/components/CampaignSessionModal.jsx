import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import {
  FaBookOpen,
  FaCalendar,
  FaChartBar,
  FaCheck,
  FaClock,
  FaCloudSun,
  FaDownload,
  FaFaceFrown,
  FaFaceMeh,
  FaFaceSmile,
  FaFlag,
  FaLocationDot,
  FaPlus,
  FaStar,
  FaUpload,
  FaUsers,
  FaXmark,
} from 'react-icons/fa6';
import { useCampaignSessionTracker } from '../hooks/useCampaignSessionTracker';
import { useCharacter } from '../state/CharacterContext';
import styles from './CampaignSessionModal.module.css';

const CampaignSessionModal = ({ isOpen, onClose }) => {
  const { character, setCharacter } = useCharacter();
  const [activeTab, setActiveTab] = useState('overview');
  const [showNewGoalForm, setShowNewGoalForm] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', description: '' });

  const {
    sessions,
    currentSession,
    campaignNotes,
    campaignGoals,
    startSession,
    endSession,
    addMilestone,
    updateCampaignNotes,
    addCampaignGoal,
    completeCampaignGoal,
    getSessionStats,
    getRecentSessions,
    exportCampaignData,
    importCampaignData,
    MILESTONE_TYPES,
  } = useCampaignSessionTracker(character, setCharacter);

  const sessionStats = getSessionStats();
  const recentSessions = getRecentSessions(10);

  const formatDuration = (minutes) => {
    if (!minutes) return '0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleStartSession = useCallback(() => {
    startSession({
      partyMembers: [],
      location: '',
      weather: '',
      mood: 'neutral',
    });
    onClose();
  }, [startSession, onClose]);

  const handleAddGoal = useCallback(() => {
    if (newGoal.title.trim()) {
      addCampaignGoal(newGoal);
      setNewGoal({ title: '', description: '' });
      setShowNewGoalForm(false);
    }
  }, [newGoal, addCampaignGoal]);

  const handleExportData = useCallback(() => {
    const data = exportCampaignData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campaign-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [exportCampaignData]);

  const handleImportData = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target.result);
            importCampaignData(data);
          } catch (error) {
            console.error('Failed to import campaign data:', error);
            alert('Failed to import campaign data. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    },
    [importCampaignData],
  );

  const getMoodIcon = (mood) => {
    switch (mood) {
      case 'positive':
        return <FaFaceSmile className={styles.moodIcon} />;
      case 'negative':
        return <FaFaceFrown className={styles.moodIcon} />;
      default:
        return <FaFaceMeh className={styles.moodIcon} />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <FaCalendar style={{ color: '#ffc107', fontSize: '18px' }} />
            </div>
            <div>
              <h2 className={styles.headerTitle}>Campaign Session Tracker</h2>
              <p className={styles.headerSubtitle}>
                Manage your campaign sessions, track progress, and plan ahead
              </p>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            <FaXmark />
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Tabs */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <FaChartBar style={{ marginRight: '8px' }} />
              Overview
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'sessions' ? styles.active : ''}`}
              onClick={() => setActiveTab('sessions')}
            >
              <FaCalendar style={{ marginRight: '8px' }} />
              Sessions
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'notes' ? styles.active : ''}`}
              onClick={() => setActiveTab('notes')}
            >
              <FaBookOpen style={{ marginRight: '8px' }} />
              Campaign Notes
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'goals' ? styles.active : ''}`}
              onClick={() => setActiveTab('goals')}
            >
              <FaFlag style={{ marginRight: '8px' }} />
              Campaign Goals
            </button>
          </div>

          {/* Overview Tab */}
          <div className={`${styles.tabContent} ${activeTab === 'overview' ? styles.active : ''}`}>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{sessionStats.totalSessions}</div>
                <div className={styles.statLabel}>Total Sessions</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{formatDuration(sessionStats.totalDuration)}</div>
                <div className={styles.statLabel}>Total Play Time</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{sessionStats.totalXpGained}</div>
                <div className={styles.statLabel}>Total XP Gained</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{sessionStats.averageXpPerSession}</div>
                <div className={styles.statLabel}>Avg XP/Session</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>
                  {formatDuration(sessionStats.averageDuration)}
                </div>
                <div className={styles.statLabel}>Avg Session Length</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>
                  {campaignGoals.filter((g) => g.status === 'active').length}
                </div>
                <div className={styles.statLabel}>Active Goals</div>
              </div>
            </div>

            {currentSession && (
              <div className={styles.currentSession}>
                <h3>Current Session</h3>
                <div className={styles.sessionCard}>
                  <div className={styles.sessionHeader}>
                    <span className={styles.sessionDate}>{formatDate(currentSession.date)}</span>
                    <span className={styles.sessionDuration}>
                      <FaClock style={{ marginRight: '4px' }} />
                      {formatDuration(currentSession.duration)}
                    </span>
                  </div>
                  <div className={styles.sessionDetails}>
                    {currentSession.location && (
                      <span className={styles.sessionLocation}>
                        <FaLocationDot style={{ marginRight: '4px' }} />
                        {currentSession.location}
                      </span>
                    )}
                    {currentSession.partyMembers.length > 0 && (
                      <span>
                        <FaUsers style={{ marginRight: '4px' }} />
                        {currentSession.partyMembers.length} players
                      </span>
                    )}
                    {currentSession.weather && (
                      <span>
                        <FaCloudSun style={{ marginRight: '4px' }} />
                        {currentSession.weather}
                      </span>
                    )}
                    <span>
                      {getMoodIcon(currentSession.mood)}
                      {currentSession.mood}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className={styles.buttonGroup}>
              {!currentSession ? (
                <button
                  type="button"
                  className={`${styles.button} ${styles.primaryButton}`}
                  onClick={handleStartSession}
                >
                  <FaPlus style={{ marginRight: '8px' }} />
                  Start New Session
                </button>
              ) : (
                <button
                  type="button"
                  className={`${styles.button} ${styles.secondaryButton}`}
                  onClick={() => setActiveTab('sessions')}
                >
                  Continue Session
                </button>
              )}
            </div>
          </div>

          {/* Sessions Tab */}
          <div className={`${styles.tabContent} ${activeTab === 'sessions' ? styles.active : ''}`}>
            {recentSessions.length === 0 ? (
              <div className={styles.emptyState}>
                <FaCalendar className={styles.emptyStateIcon} />
                <div className={styles.emptyStateTitle}>No Sessions Yet</div>
                <div className={styles.emptyStateText}>
                  Start your first session to begin tracking your campaign progress.
                </div>
              </div>
            ) : (
              <div className={styles.sessionsList}>
                {recentSessions.map((session) => (
                  <div key={session.id} className={styles.sessionCard}>
                    <div className={styles.sessionHeader}>
                      <span className={styles.sessionDate}>{formatDate(session.date)}</span>
                      <span className={styles.sessionDuration}>
                        {formatDuration(session.duration)}
                      </span>
                    </div>
                    <div className={styles.sessionDetails}>
                      <span className={styles.sessionXp}>
                        <FaStar style={{ marginRight: '4px' }} />+{session.xpGained} XP
                      </span>
                      {session.location && (
                        <span className={styles.sessionLocation}>
                          <FaLocationDot style={{ marginRight: '4px' }} />
                          {session.location}
                        </span>
                      )}
                      {session.mood && (
                        <span>
                          {getMoodIcon(session.mood)}
                          {session.mood}
                        </span>
                      )}
                    </div>
                    {session.milestones.length > 0 && (
                      <div className={styles.milestonesList}>
                        {session.milestones.slice(0, 3).map((milestone) => (
                          <span key={milestone.id} className={styles.milestoneTag}>
                            {milestone.title}
                          </span>
                        ))}
                        {session.milestones.length > 3 && (
                          <span className={styles.milestoneTag}>
                            +{session.milestones.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Campaign Notes Tab */}
          <div className={`${styles.tabContent} ${activeTab === 'notes' ? styles.active : ''}`}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Campaign Notes</label>
              <textarea
                className={styles.formTextarea}
                value={campaignNotes}
                onChange={(e) => updateCampaignNotes(e.target.value)}
                placeholder="Record important campaign information, NPCs, locations, plot threads, and other notes..."
                rows={15}
              />
            </div>
          </div>

          {/* Campaign Goals Tab */}
          <div className={`${styles.tabContent} ${activeTab === 'goals' ? styles.active : ''}`}>
            <div className={styles.buttonGroup} style={{ justifyContent: 'space-between' }}>
              <button
                type="button"
                className={`${styles.button} ${styles.primaryButton}`}
                onClick={() => setShowNewGoalForm(true)}
              >
                <FaPlus style={{ marginRight: '8px' }} />
                Add Goal
              </button>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className={`${styles.button} ${styles.secondaryButton}`}
                  onClick={handleExportData}
                >
                  <FaDownload style={{ marginRight: '8px' }} />
                  Export
                </button>
                <label
                  className={`${styles.button} ${styles.secondaryButton}`}
                  style={{ cursor: 'pointer' }}
                >
                  <FaUpload style={{ marginRight: '8px' }} />
                  Import
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>

            {showNewGoalForm && (
              <div className={styles.formGroup}>
                <div className={styles.formRow}>
                  <div>
                    <label className={styles.formLabel}>Goal Title</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={newGoal.title}
                      onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                      placeholder="Enter goal title..."
                    />
                  </div>
                  <div>
                    <label className={styles.formLabel}>Description</label>
                    <textarea
                      className={styles.formTextarea}
                      value={newGoal.description}
                      onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                      placeholder="Describe the goal..."
                      rows={3}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className={`${styles.button} ${styles.secondaryButton}`}
                    onClick={() => {
                      setShowNewGoalForm(false);
                      setNewGoal({ title: '', description: '' });
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={`${styles.button} ${styles.primaryButton}`}
                    onClick={handleAddGoal}
                  >
                    Add Goal
                  </button>
                </div>
              </div>
            )}

            {campaignGoals.length === 0 ? (
              <div className={styles.emptyState}>
                <FaFlag className={styles.emptyStateIcon} />
                <div className={styles.emptyStateTitle}>No Campaign Goals</div>
                <div className={styles.emptyStateText}>
                  Add campaign goals to track your progress and keep your story on track.
                </div>
              </div>
            ) : (
              <div className={styles.goalsList}>
                {campaignGoals.map((goal) => (
                  <div key={goal.id} className={styles.goalCard}>
                    <div className={styles.goalInfo}>
                      <div className={styles.goalTitle}>{goal.title}</div>
                      <div className={styles.goalDescription}>{goal.description}</div>
                    </div>
                    <div className={`${styles.goalStatus} ${styles[`goalStatus.${goal.status}`]}`}>
                      {goal.status}
                    </div>
                    {goal.status === 'active' && (
                      <button
                        type="button"
                        className={`${styles.button} ${styles.primaryButton}`}
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                        onClick={() => completeCampaignGoal(goal.id)}
                      >
                        <FaCheck style={{ marginRight: '4px' }} />
                        Complete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

CampaignSessionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CampaignSessionModal;
