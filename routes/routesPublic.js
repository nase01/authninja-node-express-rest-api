import express from 'express'

const routerPublic = express.Router()

// Home Page
routerPublic.get('/')

export { routerPublic }
