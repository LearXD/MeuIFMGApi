import express from 'express'
import axios from 'axios'

import { parse } from 'node-html-parser';

import HttpError, { BAD_REQUEST, INTERNAL_SERVER_ERROR, UNAUTHORIZED } from '../../HttpError.js';

import middleware from '../middleware/TokenManager.js';
import { extractDataFromHtml } from '../utils/SubjectsParse.js';

const api = express();

api.get('/', middleware, async (req, res, next) => {
    const { token } = req.headers;

    try {
        const { SERVER_HOST, SERVER_HISTORIC_ROUTE } = process.env

        const response = await axios({
            url: SERVER_HOST + SERVER_HISTORIC_ROUTE,
            method: 'GET',
            headers: { cookie: token },
            validateStatus: (status) => (status >= 200 && status < 303),
        })

        // VALIDAR SESSÃO
        if(response.request.socket._httpMessage.path && response.request.socket._httpMessage.path.startsWith("/EducaMobile/Account/Login")) {
            return next(new HttpError("O Token fornecido é inválido ou já expirado!", UNAUTHORIZED))
        }

        //console.log((await import('util')).inspect(response.request.socket._httpMessage.path, {showHidden: false, depth: null, colors: true}))
        //console.log(response.status)

        res.status(200).send(extractDataFromHtml(response.data))
    } catch (error) {
        console.log(error)
        next(new HttpError("Erro interno: " + error, INTERNAL_SERVER_ERROR))
    }
})

api.use((req, res, next) => {
    const error = new HttpError("Por favor, use o metodo GET!", BAD_REQUEST)
    next(error)
})

export default api;