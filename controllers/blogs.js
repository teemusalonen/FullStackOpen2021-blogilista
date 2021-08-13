const blogsRouter = require('express').Router()
const { response } = require('express')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs.map(b => b.toJSON()))
})
  
blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)
    
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

module.exports = blogsRouter