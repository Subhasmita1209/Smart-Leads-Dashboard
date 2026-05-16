import { Router } from 'express';
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCSV,
  getLeadStats,
  leadValidation,
  updateLeadValidation,
} from '../controllers/leadController';
import { protect, restrictTo } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();


router.use(protect);

router.get('/export/csv', exportLeadsCSV);
router.get('/stats', getLeadStats);

router.route('/')
  .get(getLeads)
  .post(leadValidation, validate, createLead);

router.route('/:id')
  .get(getLead)
  .put(updateLeadValidation, validate, updateLead)
  .delete(deleteLead);

export default router;
