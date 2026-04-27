import express from 'express';
import { createCustomPrintOrder } from '../controllers/customPrintController.js';
import { uploadRaw } from '../config/cloudinary.js';

const router = express.Router();

router.post('/', uploadRaw.single('modelFile'), createCustomPrintOrder);

export default router;
