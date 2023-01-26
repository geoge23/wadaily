import crypto from 'crypto'

//generate a HMAC cookie with the current date or a supplied date
function generateHmacCookie(id) {
    const date = new Date();
    const currentDate = date.getTime().toString()
    const hmac = hmacSha1(`${id}-${currentDate}`);
    return `${id}-${currentDate}:${hmac}`;
}

//validate a HMAC cookie with the application secret
function validateHmacString(text) {
    const [string, hmac] = text.split(':');
    return hmac === hmacSha1(string);
}

function hmacSha1(data) {
    const hmac = crypto.createHmac('sha1', process.env.HMAC_SECRET);
    hmac.update(new Buffer.from(data));
    return hmac.digest('hex');
}

function getIdFromHmac(token) {
    const id = token.split(":")[0].split("-")[0]
    return id
}

export {
    generateHmacCookie,
    validateHmacString,
    getIdFromHmac
}