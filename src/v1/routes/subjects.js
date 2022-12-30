import axios from 'axios'
import express from 'express'
import HttpError, { BAD_REQUEST, CONFLICT, INTERNAL_SERVER_ERROR, UNAUTHORIZED } from '../../HttpError.js';
import { extractSubjects } from '../utils/HtmlParser.js';

import middleware from '../middleware/TokenManager.js';

const api = express()

api.get('/', middleware, async (req, res, next) => {

    let { token } = req.headers;

    try {

        const { SERVER_HOST, SERVER_ASSESSMENTS_ROUTE } = process.env

        const response = await axios({
            url: SERVER_HOST + SERVER_ASSESSMENTS_ROUTE,
            method: 'get',
            headers: { cookie: token }
        })

        if(response.request.socket._httpMessage.path && response.request.socket._httpMessage.path.startsWith("/EducaMobile/Account/Login")) {
            return next(new HttpError("O Token fornecido é inválido ou já expirado!", UNAUTHORIZED))
        }
    
        const data = extractSubjects(response.data, token);
        if(!data) {
            return next(new HttpError(`Credenciais de usuário não definido, acesse sua conta em ${SERVER_HOST}, depois clique em "Histórico" e selecione um ano letivo. Não se esqueça de marcar a caixa de salvar período letivo!`, CONFLICT))
        }

        return res.status(200).send(data)
    } catch(error) {
        console.error(error)
        next(new HttpError("Erro interno: " + error, INTERNAL_SERVER_ERROR))
    }
    

})


api.use((req, res, next) => {
    const error = new HttpError("Por favor, use o metodo GET!", BAD_REQUEST)
    next(error)
})


export default api;