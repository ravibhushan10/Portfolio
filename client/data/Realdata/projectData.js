import image0_resume from '../screenshots/resume-builder/fornt.png'
import image1_resume from '../screenshots/resume-builder/first.png'
import image2_resume from '../screenshots/resume-builder/second.png'
import image3_resume from '../screenshots/resume-builder/third.png'
import image4_resume from '../screenshots/resume-builder/fourth.png'
import image5_resume from '../screenshots/resume-builder/fifth.png'


import image0_auth from '../screenshots/Authentication/front.png'
import image1_auth from '../screenshots/Authentication/first.png'
import image2_auth from '../screenshots/Authentication/second.png'
import image3_auth from '../screenshots/Authentication/third.png'
import image4_auth from '../screenshots/Authentication/fourth.png'


import image0_github from '../screenshots/github-profile-viewer/front.png'
import image1_github from '../screenshots/github-profile-viewer/first.png'
import image2_github from '../screenshots/github-profile-viewer/second.png'
import image3_github from '../screenshots/github-profile-viewer/third.png'
import image4_github from '../screenshots/github-profile-viewer/fourth.png'

import image0_portfolio from '../screenshots/portfolio/front.png'
import image1_portfolio from '../screenshots/portfolio/second.png'
import image2_portfolio from '../screenshots/portfolio/third.png'
import image3_portfolio from '../screenshots/portfolio/fourth.png'
import image4_portfolio from '../screenshots/portfolio/fifth.png'
import image5_portfolio from '../screenshots/portfolio/sixth.png'
import image6_portfolio from '../screenshots/portfolio/seventh.png'






export const projectsData = [
  {
    _id: "1",
    title: "Resume Builder",
    description: "A full-stack web application to create, edit, and export professional resumes with real-time preview",
    img: image0_resume,
    github: "https://github.com/ravibhushan10/Resume-builder",
    live: "https://resume-builder-ruby-omega.vercel.app",
    tags: [
    "React",
    "Redux",
    "Node.js",
    "Express",
    "mongodb",
    "JWT ",
    "bcryptjs",
    "HTML5 & CSS3"
  ],

    images: [
      image1_resume,
      image2_resume,
      image3_resume,
      image4_resume,
      image5_resume,
    ],
    fullDescription: "This project is a modern, full-stack Resume Builder built with React, Redux, and Node.js, allowing users to dynamically create resumes with live preview, PDF export, and secure cloud storage. The application focuses on scalability, clean architecture, and a seamless user experience.",
    features: [
    "Real-time resume preview while editing",
    "Responsive design for all devices",
    "User authentication and secure data storage",
    "PDF export functionality",
    "Create, update, and manage multiple resumes"
  ],
    techStack: [
    "React",
    "Redux",
    "Express",
    "Node.js",
    "mongodb",
    "JWT Authentication",
    "bcryptjs",
    "HTML5 & CSS3"
  ],
    keyLearnings:  [
    "Full-stack application architecture and REST APIs",
    "State management using Redux",
    "Secure authentication with JWT",
    "PDF generation and file handling",
    "Database design and CRUD operations",
    "Building scalable and maintainable web applications"
  ],
    futureImprovements: [
    "Multi-language resume support",
    "AI-based resume content suggestions",
    "Version history and resume analytics"
  ],
    documentation: "https://github.com/ravibhushan10/Resume-builder/blob/main/README.md"
  },
  {
    _id: "2",
    title: "Authentication System",
    description: "A modern, secure full-stack authentication system with user registration, login, and profile management",
    img: image0_auth,
    github: "https://github.com/ravibhushan10/Authentication-system",
    live: "https://authentication-system-lilac-nine.vercel.app",
    tags: [
    "React",
    "Redux Toolkit",
    "Express.js",
    "Node.js",
    "JWT",
    "MongoDB",
    "bcrypt"
  ],
    images: [
      image1_auth,
      image2_auth,
      image3_auth,
      image4_auth,

    ],
    fullDescription: "This project is a production-ready authentication system built with the MERN stack (MongoDB, Express.js, React, Node.js). It features secure user registration and login with JWT-based authentication, HTTP-only cookies for enhanced security, and comprehensive profile management capabilities. The system includes password hashing with bcrypt, protected routes, real-time form validation, and toast notifications for optimal user experience.",
    features: [
    "Secure user registration and login with validation",
    "JWT-based authentication with HTTP-only cookies",
    "User profile management (update name and password)",
    "Password hashing with bcrypt for security",
    "Real-time form validation and toast notifications",
    "Protected routes and authentication middleware",
    "RESTful API with error handling middleware"
  ],
    techStack:[
    "React 18+",
    "Redux Toolkit",
    "Node.js 16+",
    "Express.js",
    "MongoDB",
    "JWT",
    "bcrypt",
    "Mongoose",
    "React Router",
    "cookie-parser",
    "Vite"
  ],
    keyLearnings:  [
    "Implementing secure authentication with JWT and HTTP-only cookies",
    "State management with Redux Toolkit",
    "RESTful API design with Express.js",
    "MongoDB database schema design with Mongoose",
    "Password security best practices (hashing, validation)",
    "Protected route implementation on frontend and backend",
    "Production deployment configuration and CORS handling"
  ],
    futureImprovements: [
    "Email verification for new registrations",
    "Password reset via email functionality",
    "Rate limiting for API endpoints",
    "OAuth integration (Google, GitHub login)"
  ],
    documentation: "https://github.com/ravibhushan10/Authentication-system/blob/main/README.md"
  },
  {
    _id: "3",
    title: "Full-Stack Portfolio Website",
    description: "A modern full-stack portfolio website with a working contact form and an AI-powered chatbot for interactive communication",
    img: image0_portfolio,
    github: "https://github.com/ravibhushan10/Portfolio-Full-Stack",
    live: "https://ravibhushan-portfolio.vercel.app",
    tags:[
    "React",
    "Node.js",
    "Express.js",
    "MongoDB",
    "AI Chatbot",
    "REST API",
    "CSS"
  ],
    images: [
      image0_portfolio,
      image1_portfolio,
      image2_portfolio,
      image3_portfolio,
      image4_portfolio,
      image5_portfolio,
      image6_portfolio,

    ],
    fullDescription: "This project is a fully responsive full-stack portfolio website designed to represent my professional profile, technical skills, and real-world projects in a clean and interactive manner. A fully functional Contact Us form is implemented with proper input validation, error handling, and backend integration, enabling secure and reliable communication without page reloads. One of the key highlights of this project is the AI-powered chatbot integrated into the portfolio.",
  features: [
    "Responsive and modern portfolio UI design",
    "AI-powered chatbot for interactive user engagement",
    "Working Contact Us form with backend integration",
    "Form validation with success and error feedback",
    "RESTful API architecture for scalability",
    "Mobile-first and cross-browser compatible design",
    "Clean and maintainable project structure"
  ],
    techStack:[
    "React 18+",
    "Node.js",
    "Express.js",
    "MongoDB",
    "JavaScript (ES6+)",
    "REST APIs",
    "CSS",
    "Vite",
    "Git & GitHub"
  ],
    keyLearnings:  [
    "Designing and structuring a professional portfolio website",
    "Integrating frontend and backend in a full-stack application",
    "Implementing AI chatbot logic for real-time interaction",
    "Handling form submissions securely with backend validation",
    "Building scalable REST APIs",
    "Improving UI/UX through responsive and accessible design",
    "Deploying full-stack applications to production"
  ],
    futureImprovements: [
    "Admin dashboard to manage contact form submissions",
    "Enhanced AI chatbot with contextual memory",
    "Dark mode support",
    "Performance optimization and SEO improvements",
    "Multi-language support"
  ],
    documentation: "https://github.com/ravibhushan10/Portfolio-Full-Stack/blob/main/README.md"
  },

  {
    _id: "4",
    title: "GitHub Profile Viewer",
    description: "A dynamic web application to search and view GitHub user profiles with detailed statistics and repository information",
    img: image0_github,
    github: "https://github.com/ravibhushan10/github-profile-view",
    live: "https://github-profile-view-pi.vercel.app",
    tags: [
    "HTML5",
    "CSS3",
    "JavaScript",
    "GitHub API",
    "Responsive Design"
  ],
    images: [
      image1_github,
      image2_github,
      image3_github,
      image4_github,

    ],
    fullDescription: "This project is a fully responsive GitHub Profile Viewer built with vanilla JavaScript, HTML, and CSS. It leverages the GitHub REST API to fetch and display comprehensive user information including profile details, repositories, followers, and following. The application features a clean, modern UI with real-time data fetching and error handling.",
    features: [
    "Real-time GitHub user search functionality",
    "Display comprehensive user profile information",
    "View follower and following counts with details",
    "Responsive design that works on all devices",
    "Direct links to user profile and repositories"
  ],
    techStack:[
    "HTML5",
    "CSS3",
    "JavaScript",
    "Responsive Design",
    "GitHub API"
  ],
    keyLearnings:  [
    "Asynchronous JavaScript and Promises",
    "Creating reusable UI components with vanilla JS",
    "Handling API authentication with tokens",
    "Clean code organization and best practices",
    "DOM manipulation and dynamic content rendering"
  ],
    futureImprovements: [
    "Add filtering and advanced search options",
    "Display contribution graphs and activity timeline",
    "Implement caching to reduce API calls",
    "Add dark mode toggle functionality"
  ],
    documentation: "https://github.com/ravibhushan10/github-profile-view/blob/main/README.md"
  },

];
