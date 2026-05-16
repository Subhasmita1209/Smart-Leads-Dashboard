import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { body, query } from 'express-validator';
import { Lead } from '../models/Lead';
import { sendSuccess, sendError } from '../utils/response';
import { LeadStatus, LeadSource, PaginationMeta } from '../types';

export const leadValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Lost'])
    .withMessage('Invalid status'),
  body('source')
    .isIn(['Website', 'Instagram', 'Referral'])
    .withMessage('Invalid source'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),
];

export const updateLeadValidation = [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Lost'])
    .withMessage('Invalid status'),
  body('source')
    .optional()
    .isIn(['Website', 'Instagram', 'Referral'])
    .withMessage('Invalid source'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),
];

// GET /api/leads
export const getLeads = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      status,
      source,
      search,
      sort = 'latest',
      page = '1',
      limit = '10',
    } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    // Build filter object
    const filter: Record<string, unknown> = {};

    // Role-based: sales can only see their own leads
    if (req.user!.role === 'sales') {
      filter.createdBy = req.user!.id;
    }

    if (status && ['New', 'Contacted', 'Qualified', 'Lost'].includes(status)) {
      filter.status = status as LeadStatus;
    }

    if (source && ['Website', 'Instagram', 'Referral'].includes(source)) {
      filter.source = source as LeadSource;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    const sortOrder = sort === 'oldest' ? 1 : -1;

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .populate('createdBy', 'name email')
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limitNum),
      Lead.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);
    const meta: PaginationMeta = {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    };

    sendSuccess(res, leads, 'Leads fetched successfully', 200, meta);
  } catch (error) {
    next(error);
  }
};

// GET /api/leads/:id
export const getLead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email');

    if (!lead) {
      sendError(res, 'Lead not found', 404);
      return;
    }

    // Sales can only see their own leads
    if (
      req.user!.role === 'sales' &&
      lead.createdBy.toString() !== req.user!.id
    ) {
      sendError(res, 'Not authorized to view this lead', 403);
      return;
    }

    sendSuccess(res, lead);
  } catch (error) {
    next(error);
  }
};

// POST /api/leads
export const createLead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.create({
      ...req.body,
      createdBy: req.user!.id,
    });

    await lead.populate('createdBy', 'name email');
    sendSuccess(res, lead, 'Lead created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// PUT /api/leads/:id
export const updateLead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      sendError(res, 'Lead not found', 404);
      return;
    }

    // Sales can only update their own leads
    if (
      req.user!.role === 'sales' &&
      lead.createdBy.toString() !== req.user!.id
    ) {
      sendError(res, 'Not authorized to update this lead', 403);
      return;
    }

    const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('createdBy', 'name email');

    sendSuccess(res, updated, 'Lead updated successfully');
  } catch (error) {
    next(error);
  }
};

// DELETE /api/leads/:id
export const deleteLead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      sendError(res, 'Lead not found', 404);
      return;
    }

    // Only admin or lead owner can delete
    if (
      req.user!.role === 'sales' &&
      lead.createdBy.toString() !== req.user!.id
    ) {
      sendError(res, 'Not authorized to delete this lead', 403);
      return;
    }

    await Lead.findByIdAndDelete(req.params.id);
    sendSuccess(res, null, 'Lead deleted successfully');
  } catch (error) {
    next(error);
  }
};

// GET /api/leads/export/csv
export const exportLeadsCSV = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.user!.role === 'sales') {
   filter.createdBy = new mongoose.Types.ObjectId(req.user!.id);
    }

    const { status, source, search } = req.query as Record<string, string>;

    if (status) filter.status = status;
    if (source) filter.source = source;
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    const leads = await Lead.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    // Build CSV
    const headers = ['Name', 'Email', 'Status', 'Source', 'Notes', 'Created At'];
    const rows = leads.map((lead) => [
      `"${lead.name}"`,
      `"${lead.email}"`,
      `"${lead.status}"`,
      `"${lead.source}"`,
      `"${lead.notes || ''}"`,
      `"${lead.createdAt.toISOString()}"`,
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

// GET /api/leads/stats (admin only)
export const getLeadStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.user!.role === 'sales') {
       filter.createdBy = new mongoose.Types.ObjectId(req.user!.id);
    }

    const [statusStats, sourceStats, total] = await Promise.all([
      Lead.aggregate([
        { $match: filter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Lead.aggregate([
        { $match: filter },
        { $group: { _id: '$source', count: { $sum: 1 } } },
      ]),
      Lead.countDocuments(filter),
    ]);

    sendSuccess(res, { total, byStatus: statusStats, bySource: sourceStats });
  } catch (error) {
    next(error);
  }
};
