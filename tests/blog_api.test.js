const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
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


test('blog is added and is valid', async () => {
  const newBlog = {
    title: 'tehtävä 4.10',
    author: 'lohikäärme',
    url: 'kissa.com/koira',
    likes: '111'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtTheEnd = await helper.blogsInDb()
  expect(blogsAtTheEnd).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogsAtTheEnd.map(b => b.title)
  expect(titles).toContain('tehtävä 4.10')
})


test('likes is 0 if not given', async () => {
  const newBlog = {
    title: 'tehtävä 4.10',
    author: 'lohikäärme',
    url: 'kissa.com/koira'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtTheEnd = await helper.blogsInDb()
  const likes = blogsAtTheEnd.map(b => b.likes)

  // Juuri lisätyn blogin likejen arvoksi ei ole annettu mitään,
  // testataan, että arvona on 0, niin kuin kuuluisi
  expect(likes[blogsAtTheEnd.length-1]).toBeDefined()

})

test('no url', async () => {
  const newBlog = {
    title: 'tehtävä 4.10',
    author: 'lohikäärme',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('no title', async () => {
  const newBlog = {
    author: 'lohikäärme',
    url: 'sfdölkfjsdf'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('wrong user credentials', async () => {
  const newUser = {
      username: "ko",
      name: "ki",
      password: ""
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
})

afterAll(() => {
  mongoose.connection.close()
})