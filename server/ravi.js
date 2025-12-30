const mongoose = require('mongoose');
require('dotenv').config();
const Project = require('./models/Project');

async function reorderProjects() {
  await mongoose.connect(process.env.MONGO_URI);

  const projects = await Project.find().sort({ createdAt: 1 });

  for (let i = 0; i < projects.length; i++) {
    projects[i].order = i + 1;
    await projects[i].save();
  }

  console.log('Projects permanently reordered');
  process.exit(0);
}

reorderProjects();
