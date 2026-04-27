import mongoose from 'mongoose';

const collegeProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    tagline: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    originalPrice: {
        type: Number
    },
    images: [{
        type: String
    }],
    whatYouWillBuild: [{
        type: String
    }],
    whatYouWillGet: [{
        type: String
    }],
    techStack: {
        type: Map,
        of: String
    },
    difficultyLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Intermediate'
    },
    useCases: [{
        type: String
    }],
    demoLink: {
        type: String
    },
    supportDetails: [{
        type: String
    }],
    description: {
        type: String
    }
}, {
    timestamps: true
});

const CollegeProject = mongoose.model('College_Projects', collegeProjectSchema);

export default CollegeProject;
