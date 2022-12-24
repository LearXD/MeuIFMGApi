import express from 'express'

import login from './routes/login.js'
import historic from './routes/historic.js'
import profile from './routes/profile.js'

import Error, { BAD_REQUEST } from '../HttpError.js';

const api = express();

api.use('/login', login)
api.use('/historic', historic)
api.use('/profile', profile)

api.use((req, res, next) => {
    const error = new Error("Caminho não encontrado na API v1...", BAD_REQUEST)
    next(error)
})

export default api;