const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      trim: true
    },
    fullDescription: {
      type: String,
      required: [true, 'Please add full description'],
      trim: true
    },
    img: {
      type: String,
      required: [true, 'Please add thumbnail image']
    },
    images: {
      type: [String],
      required: [true, 'Please add at least one image']
    },
    tags: {
      type: [String],
      default: []
    },
    features: {
      type: [String],
      default: []
    },
    techStack: {
      type: [String],
      default: []
    },
    keyLearnings: {
      type: [String],
      default: []
    },
    futureImprovements: {
      type: [String],
      default: []
    },
    github: {
      type: String,
      required: [true, 'Please add GitHub URL']
    },
    documentation: {
      type: String,
      required: [true, 'Please add documentation URL']
    },
    live: {
      type: String,
      required: [true, 'Please add live demo URL']
    },
    // ADD THIS FIELD
    order: {
      type: Number,
      default: 999, // Default high number so new projects appear at end
      required: true
    }
  },
  // { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
