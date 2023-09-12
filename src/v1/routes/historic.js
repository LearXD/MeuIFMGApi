import express from 'express'
import axios from 'axios'

import HttpError, { BAD_REQUEST, CONFLICT, INTERNAL_SERVER_ERROR, UNAUTHORIZED } from '../../HttpError.js';

import middleware from '../middleware/TokenManager.js';
import { extractHistoric } from '../utils/HtmlParser.js';

const api = express();

api.get('/', middleware, async (req, res, next) => {
    let { token } = req.headers;
    console.log(token)

    try {
        const { SERVER_HOST, SERVER_HISTORIC_ROUTE } = process.env

        const response = await fetch(
            SERVER_HOST + SERVER_HISTORIC_ROUTE,
            {
                method: 'GET',
                headers: {
                    cookie: token,
                    "Referer": "https://meu.ifmg.edu.br/EducaMobile/Educacional/EduAluno/EduNotasAvaliacao",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
            })

        if (response.redirected) {
            return next(new HttpError("O Token fornecido é inválido ou já expirado!", UNAUTHORIZED))
        }

        const data = extractHistoric(await response.text());
        if (!data) {
            return next(new HttpError(`Credenciais de usuário não definido, acesse sua conta em ${SERVER_HOST}, depois clique em "Histórico" e selecione um ano letivo. Não se esqueça de marcar a caixa de salvar período letivo!`, CONFLICT))
        }

        res.status(200).send(data)
    } catch (error) {
        console.error(error)
        next(new HttpError("Erro interno: " + error, INTERNAL_SERVER_ERROR))
    }
})

api.use((req, res, next) => {
    const error = new HttpError("Por favor, use o metodo GET!", BAD_REQUEST)
    next(error)
})

export default api;