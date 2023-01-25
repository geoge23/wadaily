import { User } from '../../../functions/mongo'

export default async function config(req, res) {
    const { meta, id } = req.body
    const user = await User.findOne({studentId: id})
    //if meta is an object
    if (typeof meta === 'object') {
        user.meta = {...user.meta, ...meta}
    }
    await user.save()
    res.status(200).send(user)
}