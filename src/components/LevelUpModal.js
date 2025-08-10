import { useState } from 'react';

// Advanced moves available for selection
const advancedMoves = {
  appetite: { 
    name: "Appetite for Destruction", 
    desc: "Take +1d4 damage ongoing to all enemies near something you destroy utterly.",
    expanded: "When you completely demolish something in combat (a wall, door, enemy equipment), all enemies within close range take +1d4 ongoing damage from flying debris, shrapnel, or psychic backlash. This damage continues until they spend an action to clear debris or move away.",
    examples: "• Smashing through a support beam causes ceiling collapse • Destroying enemy shields creates metal shrapnel • Obliterating magical items causes arcane feedback"
  },
  khan: { 
    name: "Khan of Khans", 
    desc: "Your hirelings always accept the gratuitous fulfillment of one of your appetites as payment.",
    expanded: "When dealing with hirelings, followers, or potential allies, you can pay them by dramatically pursuing one of your appetites instead of using coin. They find your destructive displays or arcane pursuits so impressive that they consider it adequate compensation.",
    examples: "• Destroying a building to pay mercenaries • Unlocking ancient secrets to satisfy a guide • Dramatic combat displays instead of gold"
  },
  thick_skin: { 
    name: "Thick Skin", 
    desc: "You gain +1 armor or replace this move with getting +1 armor and +1 HP.",
    expanded: "Your body has adapted to constant danger. Choose when you take this move: gain +1 armor permanently, OR if you already have this move, replace it to gain both +1 armor AND +1 max HP. Stacks with worn armor.",
    examples: "• Cyber-augmented subdermal plating • Scar tissue from countless battles • Temporal field distortion around your body"
  },
  berserker: { 
    name: "Berserker", 
    desc: "When you deal damage while in combat, take +1 forward to your next move.",
    expanded: "The taste of battle fuels your fury. Every time you successfully deal damage to an enemy during combat, your next move (any move, not just attacks) gets +1. This bonus applies once per damage dealt, and multiple hits in one action give multiple bonuses.",
    examples: "• Momentum from successful hammer strikes • Adrenaline surge from drawing blood • Combat instincts becoming sharper"
  },
  eye_for_weakness: { 
    name: "Eye for Weakness", 
    desc: "When you discern realities in combat, you take +1 forward to deal damage.",
    expanded: "Your experience in battle lets you spot vulnerabilities instantly. After using Discern Realities successfully in combat to study an enemy, your next attack against that enemy gets +1 to deal damage. Works once per enemy per combat.",
    examples: "• Spotting gaps in armor plating • Identifying cybernetic weak points • Reading combat patterns for perfect timing"
  },
  multiclass_dabbler: { 
    name: "Multiclass Dabbler", 
    desc: "Get one move from another class. Treat your level as one lower for choosing the move.",
    expanded: "Your varied experiences allow you to pick up techniques from other adventuring traditions. Choose any move from Fighter, Thief, Wizard, etc. that you could take at your level -1. You keep this move permanently and can use it normally.",
    examples: "• Fighter moves for plasma weapon mastery • Wizard quantum-spells for temporal power • Thief skills for hacking and infiltration"
  },
  scent_of_prey: {
    name: "Scent of Prey",
    desc: "When you follow a trail of clues, ask the GM which enemy moved through the area recently.",
    expanded: "Your predatory instincts let you track enemies through the most chaotic environments. When investigating an area, you can sense what dangerous creatures have passed through recently, their numbers, and roughly when they were there.",
    examples: "• Detecting cyber-implant signatures • Reading disruption patterns in time-space • Sensing residual aggression or fear"
  },
  stalker: {
    name: "Stalker", 
    desc: "When you undertake a perilous journey, you can hunt. If you do, you don't roll for scout or navigate, and you get fresh rations equal to your WIS score.",
    expanded: "You're a master tracker and hunter. During travel, instead of taking a normal role, you can hunt for the group. This automatically succeeds at keeping the group fed and on track, providing wisdom score worth of rations without needing to roll.",
    examples: "• Hunting future-deer with time-displaced tactics • Finding edible fungi in temporal rifts • Catching nano-fish from data streams"
  },
  wild_speech: {
    name: "Wild Speech",
    desc: "You can understand and speak with any non-magical beast or monster.",
    expanded: "Your connection to primal forces lets you communicate with any natural creature, no matter how alien or hostile. This doesn't make them friendly, but they will understand you and respond honestly. Doesn't work on undead, constructs, or heavily magical beings.",
    examples: "• Negotiating with cyber-wolves • Understanding gravity beetle communication • Speaking with time-displaced dinosaurs"
  }
};

const LevelUpModal = ({ character, setCharacter, levelUpState, setLevelUpState, onClose, rollDie, setRollResult }) => {
  const [showMoveDetails, setShowMoveDetails] = useState('');

  // Helper functions
  const canIncreaseTwo = () => {
    const validStats = Object.entries(character.stats)
      .filter(([_, data]) => data.score < 16)
      .map(([stat, _]) => stat);
    return validStats.length >= 2;
  };

  const handleStatSelection = (stat) => {
    const currentScore = character.stats[stat].score;
    if (currentScore >= 18) return; // Max stat

    setLevelUpState(prev => {
      const alreadySelected = prev.selectedStats.includes(stat);
      if (alreadySelected) {
        return { ...prev, selectedStats: prev.selectedStats.filter(s => s !== stat) };
      }
      
      // Can't select more than 2 stats
      if (prev.selectedStats.length >= 2) return prev;
      
      // If already selected 1 stat, can only select another if both would be under 16
      if (prev.selectedStats.length === 1 && !canIncreaseTwo()) return prev;
      
      return { ...prev, selectedStats: [...prev.selectedStats, stat] };
    });
  };

  const rollHPIncrease = () => {
    const roll = rollDie(10);
    const conMod = character.stats.CON.mod;
    const increase = Math.max(1, roll + conMod); // Minimum 1 HP gain
    
    setLevelUpState(prev => ({ ...prev, hpIncrease: increase }));
    setRollResult(`HP Roll: d10(${roll}) + CON(${conMod}) = +${increase} HP`);
    
    // Add visual feedback
    const rollHistory = {
      type: 'HP Roll',
      result: `+${increase} HP`,
      rolls: [roll],
      modifier: conMod,
      total: increase,
      timestamp: new Date().toLocaleTimeString()
    };
    
    return rollHistory;
  };

  const completeLevelUp = () => {
    if (levelUpState.selectedStats.length === 0 || !levelUpState.selectedMove || levelUpState.hpIncrease === 0) {
      alert('Please complete all level up steps: select stats, choose a move, and roll for HP!');
      return;
    }

    // Update character stats
    const newStats = { ...character.stats };
    levelUpState.selectedStats.forEach(stat => {
      newStats[stat] = {
        score: newStats[stat].score + 1,
        mod: Math.floor((newStats[stat].score + 1 - 10) / 2)
      };
    });

    // Apply level up changes
    setCharacter(prev => {
      const newMaxHp = prev.maxHp + levelUpState.hpIncrease;
      return {
        ...prev,
        level: levelUpState.newLevel,
        stats: newStats,
        maxHp: newMaxHp,
        hp: newMaxHp, // Heal to full when leveling
        xp: prev.xp - prev.xpNeeded,
        xpNeeded: (levelUpState.newLevel + 1) * 7,
        selectedMoves: [...prev.selectedMoves, levelUpState.selectedMove],
        actionHistory: [
          ...prev.actionHistory.slice(-4), // Keep last 4 actions
          {
            type: 'level_up',
            data: {
              oldLevel: prev.level,
              newLevel: levelUpState.newLevel,
              statsIncreased: levelUpState.selectedStats,
              moveGained: levelUpState.selectedMove,
              hpGained: levelUpState.hpIncrease
            },
            timestamp: new Date().toISOString()
          }
        ]
      };
    });

    // Reset level up state
    setLevelUpState({ 
      selectedStats: [], 
      selectedMove: '', 
      hpIncrease: 0, 
      newLevel: levelUpState.newLevel, 
      expandedMove: '' 
    });
    
    setRollResult(`🎉 Welcome to Level ${levelUpState.newLevel}! ${levelUpState.selectedStats.join(' & ')} increased, gained "${advancedMoves[levelUpState.selectedMove].name}" move, +${levelUpState.hpIncrease} HP!`);
    onClose();
  };

  const isComplete = levelUpState.selectedStats.length > 0 && 
                    levelUpState.selectedMove && 
                    levelUpState.hpIncrease > 0;

  // Modal styles
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.9)',
    backdropFilter: 'blur(8px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    overflowY: 'auto'
  };

  const modalContentStyle = {
    background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
    border: '2px solid #00ff88',
    borderRadius: '15px',
    maxWidth: '700px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 40px rgba(0, 255, 136, 0.3)'
  };

  const headerStyle = {
    background: 'linear-gradient(45deg, #00ff88, #00cc6a)',
    padding: '20px',
    borderRadius: '13px 13px 0 0',
    textAlign: 'center',
    position: 'relative'
  };

  const buttonStyle = {
    background: 'linear-gradient(45deg, #00ff88, #00cc6a)',
    border: 'none',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    fontSize: '14px'
  };

  const statButtonStyle = (stat) => {
    const currentScore = character.stats[stat].score;
    const isSelected = levelUpState.selectedStats.includes(stat);
    const isMaxed = currentScore >= 18;
    const canSelect = !isMaxed && (
      levelUpState.selectedStats.length === 0 || 
      (levelUpState.selectedStats.length === 1 && canIncreaseTwo()) ||
      isSelected
    );

    return {
      padding: '10px',
      border: `2px solid ${isSelected ? '#00ff88' : isMaxed ? '#666' : canSelect ? '#555' : '#333'}`,
      borderRadius: '8px',
      background: isSelected ? 'rgba(0, 255, 136, 0.2)' : isMaxed ? '#333' : canSelect ? '#1a1a2e' : '#222',
      color: isSelected ? '#00ff88' : isMaxed ? '#666' : canSelect ? '#e0e0e0' : '#555',
      cursor: canSelect ? 'pointer' : 'not-allowed',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      fontSize: '14px'
    };
  };

  const moveButtonStyle = (moveId) => {
    const isSelected = levelUpState.selectedMove === moveId;
    return {
      padding: '12px',
      border: `2px solid ${isSelected ? '#00ff88' : '#555'}`,
      borderRadius: '8px',
      background: isSelected ? 'rgba(0, 255, 136, 0.2)' : '#1a1a2e',
      color: '#e0e0e0',
      cursor: 'pointer',
      textAlign: 'left',
      transition: 'all 0.3s ease',
      marginBottom: '8px'
    };
  };

  return (
    <div style={modalOverlayStyle} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={modalContentStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'white' }}>
  LEVEL UP!
</h2>
          <p style={{ margin: '5px 0 0', color: '#e0f2fe' }}>
<p style={{ margin: '5px 0 0', color: '#e0f2fe' }}>
  Zimbo advances to Level {levelUpState.newLevel}
</p>          </p>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '18px'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: '20px' }}>
          {/* Progress Indicator */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '20px',
            padding: '10px',
            background: 'rgba(0, 255, 136, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(0, 255, 136, 0.3)'
          }}>
            <div style={{ textAlign: 'center', color: levelUpState.selectedStats.length > 0 ? '#00ff88' : '#666' }}>
              <div style={{ fontSize: '20px' }}>{levelUpState.selectedStats.length > 0 ? '✅' : '1️⃣'}</div>
              <div style={{ fontSize: '12px' }}>Stats</div>
            </div>
            <div style={{ textAlign: 'center', color: levelUpState.selectedMove ? '#00ff88' : '#666' }}>
              <div style={{ fontSize: '20px' }}>{levelUpState.selectedMove ? '✅' : '2️⃣'}</div>
              <div style={{ fontSize: '12px' }}>Move</div>
            </div>
            <div style={{ textAlign: 'center', color: levelUpState.hpIncrease > 0 ? '#00ff88' : '#666' }}>
              <div style={{ fontSize: '20px' }}>{levelUpState.hpIncrease > 0 ? '✅' : '3️⃣'}</div>
              <div style={{ fontSize: '12px' }}>HP</div>
            </div>
          </div>

          {/* Step 1: Stat Selection */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#00ff88', marginBottom: '10px', fontSize: '1.2rem' }}>
              📊 Step 1: Increase Ability Scores
            </h3>
            <p style={{ color: '#e0e0e0', fontSize: '14px', marginBottom: '15px' }}>
              Choose 1 stat (max 18) or 2 stats if both are under 16:
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '10px' }}>
              {Object.entries(character.stats).map(([stat, data]) => (
                <button
                  key={stat}
                  onClick={() => handleStatSelection(stat)}
                  style={statButtonStyle(stat)}
                  disabled={data.score >= 18 || (!levelUpState.selectedStats.includes(stat) && levelUpState.selectedStats.length >= 2)}
                >
                  <div style={{ fontWeight: 'bold' }}>{stat}</div>
                  <div style={{ fontSize: '12px' }}>
                    {data.score} → {data.score >= 18 ? data.score : data.score + 1}
                    {data.score >= 18 && ' (MAX)'}
                  </div>
                  <div style={{ fontSize: '10px', opacity: 0.8 }}>
                    ({data.mod >= 0 ? '+' : ''}{data.mod} → {Math.floor((Math.min(18, data.score + 1) - 10) / 2) >= 0 ? '+' : ''}{Math.floor((Math.min(18, data.score + 1) - 10) / 2)})
                  </div>
                </button>
              ))}
            </div>
            
            {levelUpState.selectedStats.length > 0 && (
              <div style={{
                padding: '8px 12px',
                background: 'rgba(0, 255, 136, 0.1)',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#00ff88'
              }}>
                Selected: {levelUpState.selectedStats.join(', ')}
              </div>
            )}
          </div>

          {/* Step 2: Advanced Move Selection */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#00ff88', marginBottom: '10px', fontSize: '1.2rem' }}>
              ⚔️ Step 2: Choose Advanced Move
            </h3>
            <div style={{ 
              maxHeight: '250px', 
              overflowY: 'auto',
              border: '1px solid #555',
              borderRadius: '8px',
              padding: '8px'
            }}>
              {Object.entries(advancedMoves)
                .filter(([id, move]) => !character.selectedMoves.includes(id))
                .map(([id, move]) => (
                <div key={id} style={{ marginBottom: '8px' }}>
                  <div
                    onClick={() => setLevelUpState(prev => ({ ...prev, selectedMove: id }))}
                    style={moveButtonStyle(id)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ 
                          margin: 0, 
                          color: '#00ff88', 
                          fontSize: '14px', 
                          fontWeight: 'bold' 
                        }}>
                          {move.name}
                        </h4>
                        <p style={{ 
                          margin: '4px 0 0', 
                          fontSize: '12px', 
                          color: '#ccc',
                          lineHeight: '1.3'
                        }}>
                          {move.desc}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMoveDetails(showMoveDetails === id ? '' : id);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#00ff88',
                          cursor: 'pointer',
                          fontSize: '12px',
                          marginLeft: '8px'
                        }}
                      >
                        {showMoveDetails === id ? '▲' : '▼'}
                      </button>
                    </div>
                  </div>
                  
                  {/* Expanded move details */}
                  {showMoveDetails === id && (
                    <div style={{
                      padding: '12px',
                      background: 'rgba(0, 255, 136, 0.05)',
                      border: '1px solid rgba(0, 255, 136, 0.2)',
                      borderRadius: '6px',
                      marginLeft: '10px',
                      fontSize: '12px'
                    }}>
                      <p style={{ color: '#e0e0e0', marginBottom: '8px', lineHeight: '1.4' }}>
                        {move.expanded}
                      </p>
                      <div style={{ color: '#aaa' }}>
                        <strong>Examples:</strong><br />
                        {move.examples}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {levelUpState.selectedMove && (
              <div style={{
                padding: '8px 12px',
                background: 'rgba(0, 255, 136, 0.1)',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#00ff88',
                marginTop: '8px'
              }}>
                Selected: {advancedMoves[levelUpState.selectedMove].name}
              </div>
            )}
          </div>

          {/* Step 3: HP Rolling */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#00ff88', marginBottom: '10px', fontSize: '1.2rem' }}>
              ❤️ Step 3: Roll for Hit Points
            </h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              padding: '15px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid #555'
            }}>
              <button
                onClick={rollHPIncrease}
                style={{
                  ...buttonStyle,
                  background: levelUpState.hpIncrease > 0 
                    ? 'linear-gradient(45deg, #00cc6a, #00aa55)' 
                    : 'linear-gradient(45deg, #00ff88, #00cc6a)'
                }}
                disabled={levelUpState.hpIncrease > 0}
              >
                {levelUpState.hpIncrease > 0 ? '✅ HP Rolled' : '🎲 Roll d10 + CON'}
              </button>
              
              <div style={{ color: '#e0e0e0', fontSize: '14px' }}>
                Roll d10 + CON ({character.stats.CON.mod >= 0 ? '+' : ''}{character.stats.CON.mod}) for HP increase
                {levelUpState.hpIncrease > 0 && (
                  <div style={{ color: '#00ff88', fontWeight: 'bold', marginTop: '4px' }}>
                    Result: +{levelUpState.hpIncrease} HP
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Summary & Complete Button */}
          <div style={{
            padding: '15px',
            background: isComplete ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 170, 68, 0.1)',
            border: `1px solid ${isComplete ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255, 170, 68, 0.3)'}`,
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h4 style={{ color: '#00ff88', margin: '0 0 10px', fontSize: '1.1rem' }}>
              Level Up Summary
            </h4>
            <div style={{ color: '#e0e0e0', fontSize: '14px', lineHeight: '1.4' }}>
              <div>Level: {character.level} → {levelUpState.newLevel}</div>
              <div>Stats: {levelUpState.selectedStats.length > 0 ? levelUpState.selectedStats.join(' & ') : 'None selected'}</div>
              <div>Move: {levelUpState.selectedMove ? advancedMoves[levelUpState.selectedMove].name : 'None selected'}</div>
              <div>HP: {levelUpState.hpIncrease > 0 ? `+${levelUpState.hpIncrease}` : 'Not rolled'}</div>
            </div>
            
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={onClose}
                style={{
                  ...buttonStyle,
                  background: 'linear-gradient(45deg, #666, #555)',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
              
              <button
                onClick={completeLevelUp}
                disabled={!isComplete}
                style={{
                  ...buttonStyle,
                  background: isComplete 
                    ? 'linear-gradient(45deg, #00ff88, #00cc6a)' 
                    : 'linear-gradient(45deg, #666, #555)',
                  opacity: isComplete ? 1 : 0.5,
                  cursor: isComplete ? 'pointer' : 'not-allowed',
                  fontSize: '16px',
                  padding: '12px 24px'
                }}
              >
                🚀 Complete Level Up!
              </button>
            </div>
            
            {!isComplete && (
              <p style={{ 
                color: '#ffaa44', 
                fontSize: '12px', 
                margin: '8px 0 0',
                fontStyle: 'italic'
              }}>
                Complete all steps to finish leveling up
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelUpModal;