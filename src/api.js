import http from 'http'
import express from 'express'

import Error from './HttpError.js';
import version1 from './v1/index.js'

import bodyParser from "body-parser";
import morgan from 'morgan'

export default (options) => {

    const SERVER_PORT = options.port || 3000

    console.log("[API] Inciando a API...");
    const api = express();

    console.log("[API] Registrando Middlewares")
    api.use(bodyParser.urlencoded({ extended: false }));
    api.use(bodyParser.json());

    api.use(morgan('dev'));

    console.log("[API] Registrando Rotas")
    api.use('/v1', version1);

    api.get('/status', (req, res) => {
        res.status(200).send({message: 'OK', time: Date.now()})
    })

    api.use((req, res, next) => {
        next(new Error())
    })

    console.log("[API] Registrando Middlewares de Erro")
    api.use((error, req, res, next) => {
        if(!error) {
            error = new Error()
        }

        return res.status(error.statusCode).send({
            error: {
                message: error.message
            }
        })
    })


    console.log("[SERVER] Iniciando Servidor")
    const server = http.createServer(api);
    server.listen(SERVER_PORT)

    server.on('listening', () => {
        console.log("[SERVER] Servidor escutando na porta " + SERVER_PORT + "...")
    })

    server.on('error', (error) => {
        console.log("[SERVER] Server Error: " + error)
    })

    return;
}
