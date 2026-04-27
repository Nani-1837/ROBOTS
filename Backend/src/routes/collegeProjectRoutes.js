import express from 'express';
const router = express.Router();
import {
    getCollegeProjects,
    getCollegeProjectById,
    createCollegeProject,
    updateCollegeProject,
    deleteCollegeProject
} from '../controllers/collegeProjectController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

router.route('/')
    .get(getCollegeProjects)
    .post(protect, admin, upload.array('images', 5), createCollegeProject);

router.route('/:id')
    .get(getCollegeProjectById)
    .put(protect, admin, upload.array('images', 5), updateCollegeProject)
    .delete(protect, admin, deleteCollegeProject);

export default router;
