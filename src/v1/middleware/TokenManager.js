import HttpError, { BAD_REQUEST, UNAUTHORIZED } from "../../HttpError.js";

export default (req, res, next) => {
    const { token } = req.headers;
    if(token) {
        return next();
    }
    return next(new HttpError("Header `token` não definida...", UNAUTHORIZED))
}