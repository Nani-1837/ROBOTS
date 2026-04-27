import express from 'express';
import { joinCommunity } from '../controllers/communityController.js';

const router = express.Router();

router.post('/join', joinCommunity);

export default router;
