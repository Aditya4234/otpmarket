import { Response } from 'express';
import { AuthRequest } from '@/types';
import { asyncHandler } from '@/utils/asyncHandler';
import { SuccessResponse, CreatedResponse } from '@/utils/apiResponse';
import * as chatService from '@/services/chat.service';

export const createSession = asyncHandler(async (req: AuthRequest, res: Response) => {
  const chat = await chatService.createChatSession(req.user!._id, req.body);
  return new CreatedResponse('Chat session created successfully', chat).send(res);
});

export const sendMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { message } = req.body;
  const chat = await chatService.sendMessage(req.params.id, req.user!._id, 'user', message);
  return new SuccessResponse('Message sent successfully', chat).send(res);
});

export const assignChat = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { agentId } = req.body;
  const chat = await chatService.assignChat(req.params.id, agentId);
  return new SuccessResponse('Chat assigned successfully', chat).send(res);
});

export const closeChat = asyncHandler(async (req: AuthRequest, res: Response) => {
  const chat = await chatService.closeChat(req.params.id, req.user!._id);
  return new SuccessResponse('Chat closed successfully', chat).send(res);
});

export const rateChat = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { rating, comment } = req.body;
  const chat = await chatService.rateChat(req.params.id, req.user!._id, rating, comment);
  return new SuccessResponse('Chat rated successfully', chat).send(res);
});

export const listChats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await chatService.listAllChats(req.query);
  return new SuccessResponse('Chats fetched successfully', result.data, result.pagination).send(res);
});

export const getChatHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const chats = await chatService.getChatHistory(req.user!._id);
  return new SuccessResponse('Chat history fetched successfully', chats).send(res);
});

export const getChatById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const chat = await chatService.getChatById(req.params.id);
  return new SuccessResponse('Chat fetched successfully', chat).send(res);
});

export const getActiveChats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const chats = await chatService.getActiveChats(req.query.agentId as string);
  return new SuccessResponse('Active chats fetched successfully', chats).send(res);
});
