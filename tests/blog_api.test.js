const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper.test.js')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    
    console.log('haloo')
    
    let blogObject = new Blog(helper.initialBlogs[0])  
    await blogObject.save()

    console.log('haloo')

    blogObject = new Blog(helper.initialBlogs[1])  
    await blogObject.save()
})
  

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

afterAll(() => {
  mongoose.connection.close()
})