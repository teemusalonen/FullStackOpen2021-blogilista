const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('../utils/test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
        
    let blogObject = new Blog(helper.initialBlogs[0])  
    await blogObject.save()

    blogObject = new Blog(helper.initialBlogs[1])  
    await blogObject.save()
})
  

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})


test('identification is id and not _id', async () => {
  const blogs = await helper.blogsInDb()

  expect(blogs[0].id).toBeDefined()
})

afterAll(() => {
  mongoose.connection.close()
})