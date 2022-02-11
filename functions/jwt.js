import JWT from 'jsonwebtoken'
const KEY = 'testing-key'

function generateJwtForID(id) {
    return new Promise((y, n) => {
        JWT.sign({id}, KEY, {
            expiresIn: "30 days"
        }, (err, string) => {
            if (err) n(err)
            y(string)
        })
    })
}

function validateAndDecodeJwt(jwt) {
    return new Promise((y, n) => {
        JWT.verify(jwt, KEY, (err, val) => {
            if (err) return n(err)
            y(val)
        })
    })
}

export {
    generateJwtForID,
    validateAndDecodeJwt
}