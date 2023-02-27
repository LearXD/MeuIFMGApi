import start from './api.js';
import { getConfig } from './Utils.js';

(async () => {
    (await import('dotenv')).config();
    console.log("[THREAD] Iniciando....");
    const config = getConfig();
    start({ port: config.PORT });
})()