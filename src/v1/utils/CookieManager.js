export const tokenToCookies = (token) => {
    const tokens = {};
    const tokensRaw = token.split("; ");
    tokensRaw.forEach((raw) => {
        const buff = raw.split("=");
        let [name, data] = buff
        buff.shift()
        buff.shift()
        buff.length && (data += `=${buff.join('=')}`)
        tokens[name] = data
    })
    return tokens;
}

export const parseCookie = (cookie) => {
    const [ name, data ] = cookie.split(';')[0].split('=');
    return Object.fromEntries(new Map([[name, data]]));
} 

export const cookiesToString = (cookies) => {
    let str = new String()
    for (let cookieName in cookies) {
        const cookieData = cookies[cookieName];
        str += `${cookieName}=${cookieData}; `
    }
    return str.substring(0, str.length - 2); 
} 