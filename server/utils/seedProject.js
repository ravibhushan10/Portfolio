import Project from '../models/Project.js'

const seedProjects = async () => {
  try {
    const count = await Project.countDocuments()
    if (count > 0) {
      console.log('ℹ️  Projects already exist, skipping seed')
      return
    }

    const projects = [
      {
        title          : 'Resume Builder',
        description    : 'A full-stack web application to create, edit, and export professional resumes with real-time preview',
        fullDescription: 'This project is a modern, full-stack Resume Builder built with React, Redux, and Node.js, allowing users to dynamically create resumes with live preview, PDF export, and secure cloud storage. The application focuses on scalability, clean architecture, and a seamless user experience.',
        img            : { url: '', publicId: '' },
        images         : [],
        tags           : ['React', 'Redux', 'Node.js', 'Express', 'MongoDB', 'JWT', 'bcryptjs'],
        features       : [
          'Real-time resume preview while editing',
          'Responsive design for all devices',
          'User authentication and secure data storage',
          'PDF export functionality',
          'Create, update, and manage multiple resumes',
        ],
        github   : 'https://github.com/ravibhushan10/Resume-builder',
        live     : 'https://resume-builder-ruby-omega.vercel.app',
        order    : 1,
        isVisible: true,
      },
      {
        title          : 'Authentication System',
        description    : 'A modern, secure full-stack authentication system with user registration, login, and profile management',
        fullDescription: 'Production-ready authentication system built with the MERN stack featuring JWT-based authentication, HTTP-only cookies, and comprehensive profile management. Includes password hashing with bcrypt, protected routes, real-time form validation, and toast notifications.',
        img            : { url: '', publicId: '' },
        images         : [],
        tags           : ['React', 'Redux Toolkit', 'Express.js', 'Node.js', 'JWT', 'MongoDB', 'bcrypt'],
        features       : [
          'Secure user registration and login with validation',
          'JWT-based authentication with HTTP-only cookies',
          'User profile management',
          'Password hashing with bcrypt',
          'Protected routes and authentication middleware',
        ],
        github   : 'https://github.com/ravibhushan10/Authentication-system',
        live     : 'https://authentication-system-lilac-nine.vercel.app',
        order    : 2,
        isVisible: true,
      },
      {
        title          : 'Full-Stack Portfolio Website',
        description    : 'A modern full-stack portfolio with contact form, AI chatbot, and admin dashboard',
        fullDescription: 'Fully responsive full-stack portfolio website with AI-powered chatbot, working contact form with backend integration, and a complete admin dashboard for managing projects and messages. Built with React, Node.js, Express, and MongoDB.',
        img            : { url: '', publicId: '' },
        images         : [],
        tags           : ['React', 'Node.js', 'Express.js', 'MongoDB', 'AI Chatbot', 'REST API', 'CSS'],
        features       : [
          'Responsive and modern portfolio UI',
          'AI-powered chatbot for interactive engagement',
          'Working contact form with email notifications',
          'Admin dashboard with JWT auth',
          'Cloudinary image uploads',
        ],
        github   : 'https://github.com/ravibhushan10/Portfolio-Full-Stack',
        live     : 'https://ravibhushan-portfolio.vercel.app',
        order    : 3,
        isVisible: true,
      },
      {
        title          : 'GitHub Profile Viewer',
        description    : 'A dynamic web application to search and view GitHub user profiles with detailed statistics',
        fullDescription: 'Fully responsive GitHub Profile Viewer built with vanilla JavaScript using the GitHub REST API to fetch and display comprehensive user information including profile details, repositories, and followers.',
        img            : { url: '', publicId: '' },
        images         : [],
        tags           : ['HTML5', 'CSS3', 'JavaScript', 'GitHub API', 'Responsive Design'],
        features       : [
          'Real-time GitHub user search',
          'Display comprehensive profile information',
          'View follower and following counts',
          'Responsive design for all devices',
          'Direct links to repositories',
        ],
        github   : 'https://github.com/ravibhushan10/github-profile-view',
        live     : 'https://github-profile-view-pi.vercel.app',
        order    : 4,
        isVisible: true,
      },
    ]

    await Project.insertMany(projects)
    console.log('✅ Projects seeded (4 projects)')
  } catch (err) {
    console.error('❌ Project seed error:', err.message)
  }
}

export default seedProjects
