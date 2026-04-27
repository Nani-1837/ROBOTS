import express from 'express';
import { getBattle, updateBattle } from '../controllers/battleController.js';

const router = express.Router();

router.get('/', getBattle);
router.post('/', updateBattle);

export default router;
