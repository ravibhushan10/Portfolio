import express from 'express'
import { submitContact, getContacts } from '../controllers/contactController.js'

const router = express.Router()

router.post('/contact', submitContact)
router.get('/contacts', getContacts)   /* optional admin view */

export default router
