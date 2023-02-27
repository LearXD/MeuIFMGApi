import fs from 'fs';

export const getConfig = () => {
    return JSON.parse(fs.readFileSync('./config.json'));
}
