import Project   from '../models/Project.js'
import cloudinary from '../config/cloudinary.js'

export const getProjects = async (_req, res) => {
  try {
    const projects = await Project.find({ isVisible: true })
      .sort({ order: 1, createdAt: -1 })
      .select('-__v')

    return res.json({ success: true, count: projects.length, data: projects })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

export const incrementView = async (req, res) => {
  try {
    await Project.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } })
    return res.json({ success: true })
  } catch {
    return res.json({ success: false })
  }
}

export const getAllProjects = async (_req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 })
    return res.json({ success: true, count: projects.length, data: projects })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

export const createProject = async (req, res) => {
  try {
    const {
      title, description, fullDescription = '',
      tags = '[]', features = '[]',
      github = '', live = '',
      order = 0, isVisible = true,
    } = req.body

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' })
    }

    const coverImg = req.file
      ? { url: req.file.path, publicId: req.file.filename }
      : { url: '', publicId: '' }

    const carouselImgs = (req.files || []).map(f => ({
      url     : f.path,
      publicId: f.filename,
    }))

    const project = await Project.create({
      title,
      description,
      fullDescription,
      img      : coverImg,
      images   : carouselImgs,
      tags     : JSON.parse(tags),
      features : JSON.parse(features),
      github,
      live,
      order    : Number(order),
      isVisible: isVisible === 'true' || isVisible === true,
    })

    return res.status(201).json({ success: true, data: project })
  } catch (err) {
    if (err.name === 'ValidationError') {
      const first = Object.values(err.errors)[0].message
      return res.status(400).json({ success: false, message: first })
    }
    console.error('Create project error:', err)
    return res.status(500).json({ success: false, message: err.message })
  }
}

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' })

    const {
      title, description, fullDescription,
      tags, features, github, live,
      order, isVisible,
      removeImageIds,
    } = req.body

    if (title            !== undefined) project.title            = title
    if (description      !== undefined) project.description      = description
    if (fullDescription  !== undefined) project.fullDescription  = fullDescription
    if (github           !== undefined) project.github           = github
    if (live             !== undefined) project.live             = live
    if (order            !== undefined) project.order            = Number(order)
    if (isVisible        !== undefined) project.isVisible        = isVisible === 'true' || isVisible === true
    if (tags             !== undefined) project.tags             = JSON.parse(tags)
    if (features         !== undefined) project.features         = JSON.parse(features)

    if (req.file) {
      if (project.img?.publicId) {
        await cloudinary.uploader.destroy(project.img.publicId).catch(() => {})
      }
      project.img = { url: req.file.path, publicId: req.file.filename }
    }

    if (req.files?.length) {
      const newImgs = req.files.map(f => ({ url: f.path, publicId: f.filename }))
      project.images.push(...newImgs)
    }

    if (removeImageIds) {
      const ids = JSON.parse(removeImageIds)
      await Promise.allSettled(ids.map(pid => cloudinary.uploader.destroy(pid)))
      project.images = project.images.filter(img => !ids.includes(img.publicId))
    }

    await project.save()
    return res.json({ success: true, data: project })
  } catch (err) {
    console.error('Update project error:', err)
    return res.status(500).json({ success: false, message: err.message })
  }
}

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' })

    const publicIds = [
      project.img?.publicId,
      ...project.images.map(i => i.publicId),
    ].filter(Boolean)

    if (publicIds.length) {
      await Promise.allSettled(publicIds.map(pid => cloudinary.uploader.destroy(pid)))
    }

    await project.deleteOne()
    return res.json({ success: true, message: 'Project deleted' })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}
