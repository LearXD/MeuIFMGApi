import express from 'express'
import HttpError, { BAD_REQUEST, CONFLICT, INTERNAL_SERVER_ERROR } from '../../HttpError.js';
import { extractAssessments } from '../utils/HtmlParser.js';

import middleware from '../middleware/TokenManager.js';

const api = express()

api.get('/', middleware, async (req, res, next) => {

    const { id } = req.query;
    const { token } = req.headers;

    try {

        const { SERVER_HOST } = process.env

        // POR MOTIVOS DESCONHECIDOS, QUANDO EU COLOCO O LINK DA ENV O REQUEST NÃO VAI!
        const response = await fetch('https://meu.ifmg.edu.br/EducaMobile/Educacional/EduAluno/GetNotasAvaliacao?tp=A', {
            "headers": {
                "content-type": "application/x-www-form-urlencoded",
                "cookie": token,
            },
            "body": "ddlTurmaDisc=" + id,
            "method": "POST"
        })
    
        const data = extractAssessments(await response.text(), token);

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