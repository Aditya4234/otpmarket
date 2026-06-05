import { Response } from 'express';
import Ticket from '@/models/Ticket';
import Notification from '@/models/Notification';
import { AuthRequest } from '@/types';
import { asyncHandler } from '@/utils/asyncHandler';
import {
  SuccessResponse,
  NotFoundResponse,
  BadRequestResponse,
  CreatedResponse,
} from '@/utils/apiResponse';
import { buildPaginationQuery, generateTicketId } from '@/utils/helpers';

export const createTicket = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { subject, description, category, priority } = req.body;

  const ticket = await Ticket.create({
    ticketId: generateTicketId(),
    user: req.user?._id,
    subject,
    description,
    category,
    priority: priority || 'medium',
    status: 'open',
    messages: [
      {
        sender: req.user?._id,
        message: description,
        createdAt: new Date(),
      },
    ],
  });

  await Notification.create({
    user: req.user?._id,
    title: 'Support Ticket Created',
    message: `Ticket ${ticket.ticketId}: ${subject}`,
    type: 'ticket',
    link: `/tickets/${ticket.ticketId}`,
    metadata: { ticketId: ticket._id },
  });

  return new CreatedResponse('Support ticket created successfully', ticket).send(res);
});

export const getTickets = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;
  const { page, limit, skip, sort } = buildPaginationQuery(req.query as any);

  const filter: Record<string, unknown> = { user: userId };

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.category) {
    filter.category = req.query.category;
  }

  if (req.query.priority) {
    filter.priority = req.query.priority;
  }

  const [total, tickets] = await Promise.all([
    Ticket.countDocuments(filter),
    Ticket.find(filter)
      .select('-messages')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('assignedTo', 'name email')
      .lean(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return new SuccessResponse('Tickets fetched successfully', tickets, {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }).send(res);
});

export const getTicket = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { ticketId } = req.params;

  const ticket = await Ticket.findOne({
    ticketId,
    user: req.user?._id,
  })
    .populate('messages.sender', 'name avatar role')
    .populate('assignedTo', 'name email')
    .lean();

  if (!ticket) {
    return new NotFoundResponse('Ticket not found').send(res);
  }

  return new SuccessResponse('Ticket fetched successfully', ticket).send(res);
});

export const addMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { ticketId } = req.params;
  const { message, attachments } = req.body;

  const ticket = await Ticket.findOne({
    ticketId,
    user: req.user?._id,
  });

  if (!ticket) {
    return new NotFoundResponse('Ticket not found').send(res);
  }

  if (ticket.status === 'closed') {
    return new BadRequestResponse('Cannot add messages to a closed ticket').send(res);
  }

  ticket.messages.push({
    sender: req.user?._id as any,
    message,
    attachments: attachments?.map((url: string) => ({ url, name: url.split('/').pop() || '' })),
    createdAt: new Date(),
  });

  if (ticket.status === 'resolved') {
    ticket.status = 'open';
  }

  await ticket.save();

  const populatedTicket = await Ticket.findById(ticket._id)
    .populate('messages.sender', 'name avatar role')
    .populate('assignedTo', 'name email')
    .lean();

  return new SuccessResponse('Message added successfully', populatedTicket).send(res);
});

export const closeTicket = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { ticketId } = req.params;

  const ticket = await Ticket.findOne({
    ticketId,
    user: req.user?._id,
  });

  if (!ticket) {
    return new NotFoundResponse('Ticket not found').send(res);
  }

  if (ticket.status === 'closed') {
    return new BadRequestResponse('Ticket is already closed').send(res);
  }

  ticket.status = 'closed';
  ticket.closedAt = new Date();
  await ticket.save();

  return new SuccessResponse('Ticket closed successfully', ticket).send(res);
});
