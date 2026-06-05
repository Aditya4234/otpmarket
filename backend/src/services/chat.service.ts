import LiveChat from '@/models/LiveChat';
import { ApiError } from '@/utils/apiResponse';

export const createChatSession = async (userId: string, data: any) => {
  const activeSession = await LiveChat.findOne({
    user: userId,
    status: { $in: ['waiting', 'active'] },
  });

  if (activeSession) return activeSession;

  const chat = await LiveChat.create({
    user: userId,
    department: data.department || 'support',
    subject: data.subject || '',
    browserInfo: data.browserInfo,
    messages: [
      {
        sender: userId as any,
        senderType: 'user',
        message: data.message || 'Hello, I need help',
        messageType: 'text',
        isRead: false,
        createdAt: new Date(),
      },
    ],
  });

  return chat;
};

export const sendMessage = async (chatId: string, senderId: string, senderType: string, message: string, fileUrl?: string) => {
  const chat = await LiveChat.findById(chatId);
  if (!chat) throw new ApiError(404, 'Chat session not found');

  chat.messages.push({
    sender: senderId as any,
    senderType: senderType as any,
    message,
    messageType: fileUrl ? 'file' : 'text',
    fileUrl,
    isRead: false,
    createdAt: new Date(),
  });

  chat.status = chat.status === 'waiting' ? 'active' : chat.status;
  return chat.save();
};

export const assignChat = async (chatId: string, agentId: string) => {
  const chat = await LiveChat.findByIdAndUpdate(
    chatId,
    { assignedTo: agentId as any, status: 'active' },
    { new: true }
  );
  if (!chat) throw new ApiError(404, 'Chat session not found');
  return chat;
};

export const closeChat = async (chatId: string, closedBy: string) => {
  const chat = await LiveChat.findByIdAndUpdate(
    chatId,
    {
      status: 'closed',
      closedBy: closedBy as any,
      closedAt: new Date(),
      duration: Math.floor((Date.now() - (chatId as any).createdAt) / 1000),
    },
    { new: true }
  );
  if (!chat) throw new ApiError(404, 'Chat session not found');
  return chat;
};

export const rateChat = async (chatId: string, userId: string, rating: number, comment?: string) => {
  const chat = await LiveChat.findOneAndUpdate(
    { _id: chatId, user: userId },
    { rating, ratingComment: comment },
    { new: true }
  );
  if (!chat) throw new ApiError(404, 'Chat session not found');
  return chat;
};

export const getActiveChats = async (agentId?: string) => {
  const filter: any = { status: { $in: ['waiting', 'active'] } };
  if (agentId) filter.assignedTo = agentId;

  return LiveChat.find(filter)
    .populate('user', 'name email')
    .populate('assignedTo', 'name email')
    .sort({ createdAt: -1 });
};

export const getChatHistory = async (userId: string) => {
  return LiveChat.find({ user: userId })
    .populate('assignedTo', 'name')
    .sort({ createdAt: -1 });
};

export const getChatById = async (chatId: string) => {
  const chat = await LiveChat.findById(chatId)
    .populate('user', 'name email avatar')
    .populate('assignedTo', 'name email avatar')
    .populate('messages.sender', 'name avatar');
  if (!chat) throw new ApiError(404, 'Chat session not found');
  return chat;
};

export const listAllChats = async (query: any) => {
  const { page = 1, limit = 20, status, department } = query;
  const filter: any = {};
  if (status) filter.status = status;
  if (department) filter.department = department;

  const [chats, total] = await Promise.all([
    LiveChat.find(filter)
      .populate('user', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    LiveChat.countDocuments(filter),
  ]);

  return {
    data: chats,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};
