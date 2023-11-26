import 'dotenv/config'
import path from 'path'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import mongoose from 'mongoose'
import { routerAdmin, routerPublic } from './routes/index.js'
import { splitEnvVar } from './utils/splitEnvVar.js'

const app = express()

app.enable('trust proxy', 'loopback')

app.use(helmet())
app.use(express.static(path.join(path.resolve(), 'static'), { dotfiles: 'allow' }))
app.use(express.json({ limit: '20mb' })) // for base64 uploads

// CORS
const corsAllowed = process.env.CORS_ALLOWED ? splitEnvVar('CORS_ALLOWED') : '*'

const corsOptions = {
  origin: corsAllowed,
  methods: ['HEAD', 'GET', 'POST', 'PUT', 'DELETE'],
  optionsSuccessStatus: 200,
  credentials: true
}

app.options('*', cors(corsOptions))
app.use(cors(corsOptions))

// Router
app.use(routerAdmin)
  .use(routerPublic)

// Initialize App
;
(async () => {
  try {
    await mongoose.connect(`${process.env.DB_CONNECTION_STRING}`, {
      autoIndex: true
    })

    app.listen(process.env.PORT, '0.0.0.0')
  } catch (error) {
    throw new Error(error)
  }
})()
