const blogsRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs.map((b) => b.toJSON()));
});

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  const token = getTokenFrom(request);

  if (!token) {
    return response.status(401).json({ error: "token missing" });
  }

  const decodedToken = await jwt.verify(token, process.env.SECRET);

  if (!decodedToken.id) {
    return response.status(401).json({ error: "invalid token" });
  }
  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    user: user._id,
    url: body.url,
    likes: body.likes ? body.likes : 0,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog.toJSON());
});

// Toimiva!
blogsRouter.delete("/:id", async (request, response) => {
  const token = getTokenFrom(request);

  if (!token) {
    return response.status(401).json({ error: "token missing" });
  }

  const decodedToken = await jwt.verify(token, process.env.SECRET);

  if (!decodedToken.id) {
    return response.status(401).json({ error: "invalid token" });
  }
  const user = await User.findById(decodedToken.id);
  const blog = await Blog.findById(request.params.id);

  if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } else {
    response.status(401).json({ error: "Wrong user" }).end();
  }
});

blogsRouter.put("/:id", async (req, res) => {
  const newBlog = {
    likes: req.body.likes,
  };

  const updated = await Blog.findByIdAndUpdate(req.params.id, newBlog, {
    new: true,
  });

  res.json(updated.toJSON());
});

module.exports = blogsRouter;
