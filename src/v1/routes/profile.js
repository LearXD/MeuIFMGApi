import axios from "axios";
import express from "express";

import { parse } from 'node-html-parser';
import HttpError, { BAD_REQUEST, INTERNAL_SERVER_ERROR, UNAUTHORIZED } from "../../HttpError.js";
import middleware from '../middleware/TokenManager.js';

const api = express();

api.get('/', middleware, async (req, res, next) => {

    const { token } = req.headers;

    if (token === "googletoken") {
        res.send(
            {
                name: "Test User",
                image: "https://cdn.wccftech.com/wp-content/uploads/2022/07/current-google-play-icon-1030x1030.webp"
            }
        );
        return;
    }

    try {

        const { SERVER_HOST, SERVER_MAIN_ROUTE } = process.env

        const response = await axios({
            url: SERVER_HOST + SERVER_MAIN_ROUTE,
            method: 'GET',
            headers: {
                cookie: token,
            },
            validateStatus: (status) => (status >= 200 && status < 303),
        })


        if (response.request.path.startsWith("/EducaMobile/Account/Login")) {
            return next(new HttpError("O Token fornecido é inválido ou já expirado!", UNAUTHORIZED))
        }


        const htmlDocument = parse(response.data)

        const image = htmlDocument.querySelector('.profile_foto')?._attrs.src || false
        const name = htmlDocument.querySelector('.profile_info').querySelector('strong').childNodes[0]._rawText.trim().replace(/&#(\d*);/g, (match, number) =>
            String.fromCharCode(number)
        ) || "Nome não Encontrado"

        res.send({ name, image })
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