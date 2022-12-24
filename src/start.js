import api from './api.js';

(async () => {

    (await import('dotenv')).config();
    console.log("Iniciando....");

    const configuration = {
        port: 3001
    }
    
    api(configuration);
    
})()