import http from 'http';
import { Server } from 'socket.io';
import { Message, VideoCall, Notification, User } from '../models/index.js';

let onlineUsers = new Map();
let inCallUsers = new Map();

const createSocketServer = (app) => {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      methods: ['GET', 'POST']
    },
    transports: ['websocket', 'polling']
  });

  io.on('connection', (socket) => {
    console.log('🟢 User connected:', socket.id);

    socket.on('user:online', async (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.userId = userId;
      io.emit('online:users', Array.from(onlineUsers.keys()));
      
      const user = await User.findByPk(userId);
      if (user) {
        user.lastOnline = new Date();
        await user.save();
      }
    });

    socket.on('message:send', async (data) => {
      try {
        const message = await Message.create(data);
        const receiverSocket = onlineUsers.get(data.receiverId);
        if (receiverSocket) {
          io.to(receiverSocket).emit('message:receive', message);
        }
      } catch (error) {
        console.error('Message error:', error);
      }
    });

    socket.on('message:seen', async (messageId) => {
      await Message.update(
        { isSeen: true, seenAt: new Date() },
        { where: { id: messageId } }
      );
    });

    socket.on('call:initiate', async (data) => {
      const { callerId, receiverId, roomId, callType } = data;
      const receiverSocket = onlineUsers.get(receiverId);

      const call = await VideoCall.create({
        callerId,
        receiverId,
        roomId,
        callType,
        status: 'ringing'
      });

      if (receiverSocket) {
        io.to(receiverSocket).emit('call:incoming', { roomId, callerId, callType });
      }
    });

    socket.on('call:answer', async (data) => {
      const { roomId, callerId } = data;
      const callerSocket = onlineUsers.get(callerId);
      
      await VideoCall.update(
        { status: 'ongoing', startedAt: new Date() },
        { where: { roomId } }
      );

      if (callerSocket) {
        io.to(callerSocket).emit('call:answered', { roomId });
      }
      
      inCallUsers.set(roomId, [callerId, socket.userId]);
      socket.join(roomId);
    });

    socket.on('call:end', async (data) => {
      const { roomId } = data;
      
      await VideoCall.update(
        { status: 'ended', endedAt: new Date() },
        { where: { roomId } }
      );

      inCallUsers.delete(roomId);
      io.to(roomId).emit('call:ended');
      socket.leave(roomId);
    });

    socket.on('call:reject', async (data) => {
      const { roomId, callerId } = data;
      const callerSocket = onlineUsers.get(callerId);
      
      await VideoCall.update(
        { status: 'declined' },
        { where: { roomId } }
      );

      if (callerSocket) {
        io.to(callerSocket).emit('call:rejected');
      }
    });

    socket.on('notification:send', async (data) => {
      try {
        const notification = await Notification.create(data);
        const userSocket = onlineUsers.get(data.userId);
        if (userSocket) {
          io.to(userSocket).emit('notification:receive', notification);
        }
      } catch (error) {
        console.error('Notification error:', error);
      }
    });

    socket.on('typing:start', (data) => {
      const { conversationId, userId } = data;
      const receiverSocket = onlineUsers.get(data.receiverId);
      if (receiverSocket) {
        io.to(receiverSocket).emit('typing:indicator', { conversationId, userId, typing: true });
      }
    });

    socket.on('typing:stop', (data) => {
      const receiverSocket = onlineUsers.get(data.receiverId);
      if (receiverSocket) {
        io.to(receiverSocket).emit('typing:indicator', { typing: false });
      }
    });

    socket.on('disconnect', async () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit('online:users', Array.from(onlineUsers.keys()));
        
        const user = await User.findByPk(socket.userId);
        if (user) {
          user.lastOnline = new Date();
          await user.save();
        }
      }
      console.log('🔴 User disconnected:', socket.id);
    });
  });

  return server;
};

export { createSocketServer, onlineUsers };
