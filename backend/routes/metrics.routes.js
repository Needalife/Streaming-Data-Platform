import express from 'express';
import { getAllFunctionMetrics } from '../controller/metrics.controller.js';

const router = express.Router();

router.get('/', getAllFunctionMetrics);

export default router;
