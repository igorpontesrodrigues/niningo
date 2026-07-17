export function registerChatSocket(io) {
  const chat = io.of('/chat');

  chat.on('connection', (socket) => {
    console.log(`💬 Chat socket connected: ${socket.id}`);

    // Join location room
    socket.on('chat:join', ({ locationId, characterId, channels }) => {
      // Always join local room
      socket.join(`local:${locationId}`);
      socket.data.characterId = characterId;
      socket.data.locationId = locationId;

      // Join additional channels if unlocked
      if (channels?.village) socket.join(`village:${channels.villageId}`);
      if (channels?.clan)    socket.join(`clan:${channels.clanId}`);
      if (channels?.squad)   socket.join(`squad:${channels.squadId}`);
    });

    socket.on('chat:send', ({ channel, content, meta }) => {
      const msg = {
        characterId: socket.data.characterId,
        content,
        timestamp: new Date().toISOString(),
        channel,
        ...meta,
      };

      switch (channel) {
        case 'local':
          chat.to(`local:${socket.data.locationId}`).emit('chat:message', msg);
          break;
        case 'village':
          if (meta?.villageId) chat.to(`village:${meta.villageId}`).emit('chat:message', msg);
          break;
        case 'clan':
          if (meta?.clanId) chat.to(`clan:${meta.clanId}`).emit('chat:message', msg);
          break;
        case 'global':
          chat.emit('chat:message', msg); // broadcast to all
          break;
      }
    });

    socket.on('disconnect', () => {
      console.log(`💬 Chat socket disconnected: ${socket.id}`);
    });
  });
}
