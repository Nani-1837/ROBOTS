import CustomPrintOrder from '../models/CustomPrintOrder.js';
import { cloudinary } from '../config/cloudinary.js';
import streamifier from 'streamifier';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

export const createCustomPrintOrder = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'GLB model file is required' });
    }

    const { material, contact, shipping } = req.body;
    
    // Parse the JSON strings sent via FormData
    const parsedContact = JSON.parse(contact);
    const parsedShipping = JSON.parse(shipping);

    // Handle Large File Upload (Chunked)
    const tempFilePath = path.join(os.tmpdir(), `upload-${Date.now()}-${req.file.originalname}`);
    await writeFile(tempFilePath, req.file.buffer);

    const result = await cloudinary.uploader.upload(tempFilePath, {
      folder: 'bisonix_custom_prints',
      resource_type: 'raw',
      chunk_size: 6000000 // 6MB chunks
    });

    // Cleanup temp file
    await unlink(tempFilePath);

    // Create Order
    const newOrder = await CustomPrintOrder.create({
      modelUrl: result.secure_url,
      material,
      contact: parsedContact,
      shipping: parsedShipping
    });

    res.status(201).json({
      message: 'Quotation request submitted successfully!',
      order: newOrder
    });
  } catch (error) {
    console.error('Custom Print Upload Error:', error);
    res.status(500).json({ message: error.message || 'Error processing request' });
  }
};
