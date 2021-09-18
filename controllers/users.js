const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs')
  console.log('get :DD:DD:DD:DD:DD')
  response.json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (request, response) => {
  const body = request.body
  //const users = await User.find({})
  
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  /*console.log('body.username.length', body.username.length)
  console.log('users...', (users.find(u => u.username === body.username) === undefined))
  console.log('body.password', body.password)

  if(body.username.length < 3 | !(users.find(u => u.username === body.username) === undefined) | !body.password){
    return response.status(400).json({ error: 'invalid user credentials' })
  }*/

  if(!body.username || !body.password || body.password.length < 3){
    return response.status(400).json({ error: 'invalid user information' })
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