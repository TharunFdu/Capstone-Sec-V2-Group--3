module.exports = (io, socket) => {
    socket.on('joinGroup', ({ groupId }) => {
      socket.join(groupId);
      console.log(`User joined group ${groupId}`);
    });
  
    socket.on('sendMessage', ({ groupId, message }) => {
      io.to(groupId).emit('newMessage', { groupId, message });
      console.log(`Message sent to group ${groupId}: ${message}`);
    });
  
    socket.on('disconnect', () => {
      console.log('User disconnected from chat');
    });
  };
  