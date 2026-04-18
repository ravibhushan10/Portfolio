import express from 'express'
import protect  from '../middleware/auth.js'
import { loginLimiter } from '../middleware/rateLimit.js'
import { uploadProjectImages } from '../middleware/upload.js'

import { adminLogin, getMe, changePassword }                 from '../controllers/adminController.js'
import { getContacts, updateContact, deleteContact,
         getContactStats }                                   from '../controllers/contactController.js'
import { getAllProjects, createProject,
         updateProject, deleteProject }                      from '../controllers/projectController.js'

const router = express.Router()

/* ── Auth ── */
router.post  ('/login',     loginLimiter, adminLogin)
router.get   ('/me',        protect, getMe)
router.patch ('/password',  protect, changePassword)

/* ── Contacts ── */
router.get   ('/contacts',          protect, getContacts)
router.get   ('/contacts/stats',    protect, getContactStats)
router.patch ('/contacts/:id',      protect, updateContact)
router.delete('/contacts/:id',      protect, deleteContact)

/* ── Projects ── */
router.get   ('/projects',      protect, getAllProjects)

// Create: one cover + up to 10 carousel images
router.post  ('/projects', protect,
  uploadProjectImages.fields([
    { name: 'coverImage', maxCount: 1  },
    { name: 'images',     maxCount: 10 },
  ]),
  createProject
)

// Update
router.put   ('/projects/:id', protect,
  uploadProjectImages.fields([
    { name: 'coverImage', maxCount: 1  },
    { name: 'images',     maxCount: 10 },
  ]),
  updateProject
)

router.delete('/projects/:id', protect, deleteProject)

export default router
