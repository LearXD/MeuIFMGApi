import express from 'express'
import axios from 'axios';

import HttpError, { BAD_REQUEST, INTERNAL_SERVER_ERROR, UNAUTHORIZED } from '../../HttpError.js';

import { cookiesToString, parseCookie } from '../utils/CookieManager.js';

const api = express();

api.post('/', async (req, res, next) => {

    const { registration, password } = req.body;

    if (!registration) {
        next(new HttpError("Matrícula `registration` de usuário não definida!", BAD_REQUEST))
    }

    if (!password) {
        next(new HttpError("Senha `password` de usuário não definida!", BAD_REQUEST))
    }

    try {

        let cookies = [];

        const { SERVER_HOST, SERVER_LOGIN_ROUTE, SERVER_HISTORIC_ROUTE } = process.env

        const loginResponse = await axios({
            url: SERVER_HOST + SERVER_LOGIN_ROUTE,
            method: 'post',
            maxRedirects: 0,
            data: {
                "UserName": registration,
                "Password": password,
                "RememberMe": "false"
            },
            validateStatus: (status) => (status >= 200 && status < 303),
        })


        if (loginResponse.status != 302) {
            return next(new HttpError("`Usuário` ou `Senha` de login incorretos ou inexistentes!", UNAUTHORIZED))
        }


        if (loginResponse.headers && loginResponse.headers['set-cookie']) {
            loginResponse.headers['set-cookie'].forEach((cookie) => {
                cookies = {
                    ...cookies,
                    ...parseCookie(cookie)
                }
            })
        }

        cookies =
        {
            ...cookies,
            RedirectUrlContexto: "https://meu.ifmg.edu.br:443/EducaMobile/Educacional/EduAluno/EduNotasFaltasEtapa?tp=A",
            EduTipoUser: "A"
        }

        const cookiesStr = cookiesToString(cookies)

        axios({
            url: SERVER_HOST + SERVER_HISTORIC_ROUTE,
            method: 'get',
            headers: { cookie: cookiesStr },
        }).catch(err => { });

        res.status(200).send({
            token: cookiesStr
        })

    } catch (error) {
        console.error(error)
        next(new HttpError("Erro interno: " + error, INTERNAL_SERVER_ERROR))
    }
})

api.use((req, res, next) => {
    const error = new HttpError("Por favor, use o metodo POST!", BAD_REQUEST)
    next(error)
})

export default api;