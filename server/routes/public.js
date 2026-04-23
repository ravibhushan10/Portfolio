import express from 'express'
import { submitContact }              from '../controllers/contactController.js'
import { getProjects, incrementView } from '../controllers/projectController.js'
import { contactLimiter }             from '../middleware/rateLimit.js'

const router = express.Router()


router.post('/contact',           contactLimiter, submitContact)


router.get('/projects',           getProjects)


router.post('/projects/:id/view', incrementView)

export default router
