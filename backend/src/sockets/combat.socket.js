const TURN_TIMEOUT_MS = 15000; // 15 seconds

// Active combats: Map<roomId, combatState>
const activeCombats = new Map();

export function registerCombatSocket(io) {
  const combat = io.of('/combat');

  combat.on('connection', (socket) => {
    console.log(`⚔️  Combat socket connected: ${socket.id}`);

    socket.on('combat:start', async ({ characterId, enemyId, travelLogId }) => {
      const roomId = `combat:${characterId}`;
      socket.join(roomId);

      // Initialize combat state
      const state = {
        characterId,
        enemyId,
        travelLogId,
        turn: 'player',
        round: 1,
        playerHp: 100,    // Will be fetched from DB in production
        playerMaxHp: 100,
        playerChakra: 50,
        enemyHp: 80,
        enemyMaxHp: 80,
        timer: null,
      };

      activeCombats.set(roomId, state);

      // Emit initial state
      combat.to(roomId).emit('combat:state', state);

      // Start player turn timer
      startTurnTimer(combat, roomId, state);
    });

    socket.on('combat:action', ({ characterId, action, jutsuId }) => {
      const roomId = `combat:${characterId}`;
      const state = activeCombats.get(roomId);
      if (!state || state.turn !== 'player') return;

      clearTimeout(state.timer);
      processPlayerAction(combat, roomId, state, action, jutsuId);
    });

    socket.on('disconnect', () => {
      console.log(`⚔️  Combat socket disconnected: ${socket.id}`);
    });
  });
}

function startTurnTimer(combat, roomId, state) {
  state.timer = setTimeout(() => {
    // Auto-defend if player doesn't act
    processPlayerAction(combat, roomId, state, 'defend', null);
  }, TURN_TIMEOUT_MS);
}

function processPlayerAction(combat, roomId, state, action, jutsuId) {
  let damage = 0;
  let message = '';

  switch (action) {
    case 'basic':
      damage = Math.floor(Math.random() * 10) + 5;
      state.enemyHp = Math.max(0, state.enemyHp - damage);
      message = `Você atacou causando ${damage} de dano!`;
      break;
    case 'defend':
      message = 'Você se defendeu!';
      break;
    case 'flee':
      activeCombats.delete(roomId);
      combat.to(roomId).emit('combat:fled');
      return;
    default:
      damage = Math.floor(Math.random() * 15) + 8;
      state.enemyHp = Math.max(0, state.enemyHp - damage);
      message = `Jutsu causou ${damage} de dano!`;
  }

  // Check enemy death
  if (state.enemyHp <= 0) {
    activeCombats.delete(roomId);
    combat.to(roomId).emit('combat:victory', { xpGained: 20, ryoGained: 10 });
    return;
  }

  // Enemy turn
  state.turn = 'enemy';
  combat.to(roomId).emit('combat:state', { ...state, message });

  setTimeout(() => {
    const enemyDamage = Math.floor(Math.random() * 8) + 3;
    state.playerHp = Math.max(0, state.playerHp - enemyDamage);

    if (state.playerHp <= 0) {
      activeCombats.delete(roomId);
      combat.to(roomId).emit('combat:defeat');
      return;
    }

    state.turn = 'player';
    state.round++;
    combat.to(roomId).emit('combat:state', { ...state, message: `Inimigo atacou causando ${enemyDamage} de dano!` });
    startTurnTimer(combat, roomId, state);
  }, 1500);
}
