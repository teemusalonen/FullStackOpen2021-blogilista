const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (request, response) => {
  const body = request.body
  const users = await User.find({})
  
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)
  
  if(body.name.length < 3 | !users.find(u => u.username !== body.username) | !body.passwordHash){
    return response.status(400).json({ error: 'invalid user credentials' })
  }

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

module.exports = usersRouter