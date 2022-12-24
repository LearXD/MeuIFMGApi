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