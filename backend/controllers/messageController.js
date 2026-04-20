import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';

// POST /api/messages/conversations — Get or create a conversation between two users
export const getOrCreateConversation = async (req, res) => {
  try {
    const { participant1, participant2 } = req.body;
    // participant1 & participant2: { userId, role, name, avatar? }

    if (!participant1?.userId || !participant2?.userId) {
      return res.status(400).json({ status: 'error', message: 'Both participants are required.' });
    }

    // Check if conversation already exists between these two users
    let conversation = await Conversation.findOne({
      $and: [
        { 'participants.userId': participant1.userId },
        { 'participants.userId': participant2.userId },
      ],
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [
          {
            userId: participant1.userId,
            role: participant1.role,
            name: participant1.name,
            avatar: participant1.avatar || '',
          },
          {
            userId: participant2.userId,
            role: participant2.role,
            name: participant2.name,
            avatar: participant2.avatar || '',
          },
        ],
        lastMessage: '',
        lastMessageAt: new Date(),
      });
    }

    res.status(200).json({ status: 'success', data: conversation });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// GET /api/messages/conversations/:userId — List all conversations for a user
export const getConversations = async (req, res) => {
  try {
    const { userId } = req.params;

    const conversations = await Conversation.find({
      'participants.userId': userId,
    }).sort({ lastMessageAt: -1 });

    // For each conversation, count unread messages (not sent by this user and not read)
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await Message.countDocuments({
          conversationId: conv._id,
          senderId: { $ne: userId },
          read: false,
        });
        return {
          ...conv.toObject(),
          unreadCount,
        };
      })
    );

    res.status(200).json({ status: 'success', data: conversationsWithUnread });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// GET /api/messages/:conversationId/messages — Get all messages in a conversation
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

    res.status(200).json({ status: 'success', data: messages });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// POST /api/messages/send — Send a new message
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, senderName, senderRole, text } = req.body;

    if (!conversationId || !senderId || !text) {
      return res.status(400).json({ status: 'error', message: 'conversationId, senderId, and text are required.' });
    }

    const message = await Message.create({
      conversationId,
      senderId,
      senderName: senderName || 'Unknown',
      senderRole: senderRole || 'student',
      text,
    });

    // Update conversation's last message
    const conversation = await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: text.length > 80 ? text.substring(0, 80) + '...' : text,
      lastMessageAt: new Date(),
      lastMessageSenderId: senderId,
    }, { new: true });

    // Notify the other participant
    try {
      if (conversation) {
        const recipient = conversation.participants.find((p) => p.userId !== senderId);
        if (recipient) {
          await Notification.create({
            recipientId: recipient.userId,
            type: 'new_message',
            message: `New message from ${senderName || 'Someone'}: "${text.length > 40 ? text.substring(0, 40) + '...' : text}"`,
          });
        }
      }
    } catch (notifErr) {
      console.error('Failed to send message notification:', notifErr);
    }

    res.status(201).json({ status: 'success', data: message });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// PATCH /api/messages/read/:conversationId — Mark all messages as read for a user
export const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { userId } = req.body; // the user who is reading (mark OTHER user's messages as read)

    if (!userId) {
      return res.status(400).json({ status: 'error', message: 'userId is required.' });
    }

    await Message.updateMany(
      {
        conversationId,
        senderId: { $ne: userId },
        read: false,
      },
      { read: true }
    );

    res.status(200).json({ status: 'success', message: 'Messages marked as read.' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
