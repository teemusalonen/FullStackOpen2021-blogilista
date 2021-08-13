const Blog = require('../models/blog')

const initialBlogs = [
    {
        "title": "modsadadi",
        "author": "kissa",
        "url": "sdfsdf",
        "likes": 1
    },
    {
        "title": "asdsad",
        "author": "kissa",
        "url": "sdffffsdf",
        "likes": 2
    }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(b => b.toJSON())
}

module.exports = {
    initialBlogs,
    blogsInDb
}