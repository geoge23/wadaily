import JWT from 'jsonwebtoken'

export default function generateJwtForID(id) {
    return new Promise((y, n) => {
        JWT.sign({id}, 'testing-key', {
            expiresIn: "30 days"
        }, (err, string) => {
            if (err) n(err)
            y(string)
        })
    })
}