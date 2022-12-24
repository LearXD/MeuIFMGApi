import http from 'http'
import express from 'express'

import Error from './HttpError.js';
import version1 from './v1/index.js'

import bodyParser from "body-parser";
import morgan from 'morgan'

export default (options) => {

    const SERVER_PORT = options.port || 3000

    console.log(">> Inciando a API...");
    const api = express();

    api.use(bodyParser.urlencoded({ extended: false }));
    api.use(bodyParser.json());

    api.use(morgan('dev'));

    console.log(">>> Registrando V1")
    api.use('/v1', version1);


    api.use((req, res, next) => {
        next(new Error())
    })

    // PARA ERROS
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


    const server = http.createServer(api);
    server.listen(SERVER_PORT)

    server.on('listening', () => {
        console.log(">> Servidor escutando na porta " + SERVER_PORT + "...")
    })

    server.on('error', (error) => {
        console.log(">> Server Error: " + error)
    })

    return;
}
