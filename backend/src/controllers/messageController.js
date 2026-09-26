import { Message, User, Block } from '../models/index.js';
import { Op } from 'sequelize';

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, text, image, video, audio } = req.body;

    const blocked = await Block.findOne({
      where: {
        [Op.or]: [
          { blockerId: receiverId, blockedId: req.user.id },
          { blockerId: req.user.id, blockedId: receiverId }
        ]
      }
    });
    if (blocked) return res.status(403).json({ message: 'Cannot message this user' });

    const message = await Message.create({
      senderId: req.user.id,
      receiverId,
      text,
      image,
      video,
      audio
    });

    const populated = await message.reload({
      include: [{ model: User, as: 'sender' }, { model: User, as: 'receiver' }]
    });

    res.status(201).json({ message: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = req.query.page || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: req.user.id, receiverId: userId },
          { senderId: userId, receiverId: req.user.id }
        ]
      },
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    await Message.update(
      { isRead: true, readAt: new Date() },
      {
        where: {
          senderId: userId,
          receiverId: req.user.id,
          isRead: false
        }
      }
    );

    res.json({ messages: messages.reverse(), page });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getConversations = async (req, res) => {
  try {
    const conversations = await Message.findAll({
      where: {
        [Op.or]: [{ senderId: req.user.id }, { receiverId: req.user.id }]
      },
      attributes: ['senderId', 'receiverId', 'text', 'createdAt', 'isRead'],
      order: [['createdAt', 'DESC']],
      limit: 50,
      raw: true,
      group: ['senderId', 'receiverId']
    });

    res.json({ conversations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
