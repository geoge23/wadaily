import dbConnect, { Users } from '../../../functions/mongo'
import { validateHmacString, getIdFromHmac } from '../../../functions/hmac'


export default async function config(req, res) {
    //ensure connected to db
    await dbConnect()

    const { preferences } = req.body
    const { authorization } = req.headers
    const token = authorization.split(" ")[1]
    if (!validateHmacString(token)) {
        return res.status(401).send({ status: "invalid_token" })
    }
    const id = getIdFromHmac(token)
    const user = await Users.findOne({studentId: id})
    //if meta is an object
    if (typeof preferences === 'object') {
        user.preferences = {...user.preferences, ...preferences}
    }
    await user.save()
    res.status(200).send(user)
}