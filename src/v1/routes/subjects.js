import axios from 'axios'
import express from 'express'
import HttpError, { BAD_REQUEST, CONFLICT, INTERNAL_SERVER_ERROR, UNAUTHORIZED } from '../../HttpError.js';
import { extractSubjects } from '../utils/HtmlParser.js';
import fs from 'fs';

import middleware from '../middleware/TokenManager.js';

const api = express()

api.get('/', middleware, async (req, res, next) => {

    let { token } = req.headers;

    if (token === "googletoken") {
        res.send(fs.readFileSync('./src/assets/play-store/subjects.json', 'utf8'));
        return;
    }

    try {

        const { SERVER_HOST, SERVER_ASSESSMENTS_ROUTE } = process.env

        const response = await axios({
            url: SERVER_HOST + SERVER_ASSESSMENTS_ROUTE,
            method: 'get',
            validateStatus: (status) => true,
            headers: {
                cookie: token,
                "Referer": "https://meu.ifmg.edu.br/EducaMobile/Educacional/EduAluno/EduNotasAvaliacao",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            }
        })

        if (response.request.path.startsWith("/EducaMobile/Account/Login")) {
            return next(new HttpError("O Token fornecido é inválido ou já expirado!", UNAUTHORIZED))
        }

        const data = extractSubjects(response.data);
        if (!data) {
            return next(new HttpError(`Credenciais de usuário não definido, acesse sua conta em ${SERVER_HOST}, depois clique em "Histórico" e selecione um ano letivo. Não se esqueça de marcar a caixa de salvar período letivo!`, CONFLICT))
        }

        return res.status(200).send(data)
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