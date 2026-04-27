import CollegeProject from '../models/CollegeProject.js';

// @desc    Get all college projects
// @route   GET /api/college-projects
// @access  Public
export const getCollegeProjects = async (req, res) => {
    try {
        const projects = await CollegeProject.find({});
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single college project
// @route   GET /api/college-projects/:id
// @access  Public
export const getCollegeProjectById = async (req, res) => {
    try {
        const project = await CollegeProject.findById(req.params.id);

        if (project) {
            res.json(project);
        } else {
            res.status(404).json({ message: 'College Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a college project
// @route   POST /api/college-projects
// @access  Private/Admin
export const createCollegeProject = async (req, res) => {
    try {
        const imageUrls = req.files ? req.files.map(file => file.path) : [];

        const {
            name,
            tagline,
            price,
            originalPrice,
            whatYouWillBuild,
            whatYouWillGet,
            techStack,
            difficultyLevel,
            useCases,
            demoLink,
            supportDetails,
            description
        } = req.body;

        const project = new CollegeProject({
            name,
            tagline,
            price,
            originalPrice,
            images: imageUrls,
            whatYouWillBuild: typeof whatYouWillBuild === 'string' ? JSON.parse(whatYouWillBuild) : whatYouWillBuild,
            whatYouWillGet: typeof whatYouWillGet === 'string' ? JSON.parse(whatYouWillGet) : whatYouWillGet,
            techStack: typeof techStack === 'string' ? JSON.parse(techStack) : techStack,
            difficultyLevel,
            useCases: typeof useCases === 'string' ? JSON.parse(useCases) : useCases,
            demoLink,
            supportDetails: typeof supportDetails === 'string' ? JSON.parse(supportDetails) : supportDetails,
            description
        });

        const createdProject = await project.save();
        res.status(201).json(createdProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a college project
// @route   PUT /api/college-projects/:id
// @access  Private/Admin
export const updateCollegeProject = async (req, res) => {
    try {
        const {
            name,
            tagline,
            price,
            originalPrice,
            whatYouWillBuild,
            whatYouWillGet,
            techStack,
            difficultyLevel,
            useCases,
            demoLink,
            supportDetails,
            description,
            images
        } = req.body;

        const project = await CollegeProject.findById(req.params.id);

        if (project) {
            if (req.files && req.files.length > 0) {
                project.images = req.files.map(file => file.path);
            } else if (images) {
                project.images = Array.isArray(images) ? images : [images];
            }

            project.name = name || project.name;
            project.tagline = tagline || project.tagline;
            project.price = price || project.price;
            project.originalPrice = originalPrice || project.originalPrice;
            project.whatYouWillBuild = whatYouWillBuild ? (typeof whatYouWillBuild === 'string' ? JSON.parse(whatYouWillBuild) : whatYouWillBuild) : project.whatYouWillBuild;
            project.whatYouWillGet = whatYouWillGet ? (typeof whatYouWillGet === 'string' ? JSON.parse(whatYouWillGet) : whatYouWillGet) : project.whatYouWillGet;
            project.techStack = techStack ? (typeof techStack === 'string' ? JSON.parse(techStack) : techStack) : project.techStack;
            project.difficultyLevel = difficultyLevel || project.difficultyLevel;
            project.useCases = useCases ? (typeof useCases === 'string' ? JSON.parse(useCases) : useCases) : project.useCases;
            project.demoLink = demoLink || project.demoLink;
            project.supportDetails = supportDetails ? (typeof supportDetails === 'string' ? JSON.parse(supportDetails) : supportDetails) : project.supportDetails;
            project.description = description || project.description;

            const updatedProject = await project.save();
            res.json(updatedProject);
        } else {
            res.status(404).json({ message: 'College Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a college project
// @route   DELETE /api/college-projects/:id
// @access  Private/Admin
export const deleteCollegeProject = async (req, res) => {
    try {
        const project = await CollegeProject.findById(req.params.id);

        if (project) {
            await project.deleteOne();
            res.json({ message: 'College Project removed' });
        } else {
            res.status(404).json({ message: 'College Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
