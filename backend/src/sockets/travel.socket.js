export function registerTravelSocket(io) {
  const travel = io.of('/travel');

  travel.on('connection', (socket) => {
    console.log(`🗺️  Travel socket connected: ${socket.id}`);

    socket.on('travel:track', ({ characterId, travelLogId }) => {
      socket.join(`travel:${characterId}`);
      socket.data.characterId = characterId;
      socket.data.travelLogId = travelLogId;
    });

    // Roll PvP encounter during travel
    socket.on('travel:tick', ({ characterId, currentPvpChance }) => {
      const roll = Math.random();
      if (roll < currentPvpChance) {
        // PvP encounter!
        const enemy = getRandomEnemy();
        travel.to(`travel:${characterId}`).emit('travel:encounter', { enemy });
      }
    });

    socket.on('travel:victory', ({ characterId, mode, victories }) => {
      const newChance = Math.max(0, calculateNewChance(mode, victories));
      const upgraded = mode === 'normal' && newChance === 0 ? 'fast' : mode;
      travel.to(`travel:${characterId}`).emit('travel:update', {
        pvpChance: newChance,
        mode: upgraded,
        message: upgraded !== mode ? '⚡ Caminho limpo! Viagem acelerada!' : `Chance de encontro: ${Math.round(newChance * 100)}%`,
      });
    });

    socket.on('travel:defeat', ({ characterId }) => {
      travel.to(`travel:${characterId}`).emit('travel:forced_safe', {
        message: 'Derrota! Viajando com cuidado agora...',
        restDurationMs: 30 * 60 * 1000,
      });
    });

    socket.on('disconnect', () => {
      console.log(`🗺️  Travel socket disconnected: ${socket.id}`);
    });
  });
}

function calculateNewChance(mode, victories) {
  const base = mode === 'fast' ? 0.40 : 0.15;
  return base - (victories * 0.05);
}

function getRandomEnemy() {
  const enemies = [
    { id: 'bandit', name: 'Ninja Renegado', hp: 60, level: 3 },
    { id: 'wolf', name: 'Lobo Sombrio', hp: 45, level: 2 },
    { id: 'ronin', name: 'Ronin Errante', hp: 75, level: 4 },
  ];
  return enemies[Math.floor(Math.random() * enemies.length)];
}
