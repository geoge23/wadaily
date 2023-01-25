import { User } from '../../../functions/mongo'

export default async function login(req, res) {
    const { id } = req.body
    const user = await User.findOne({studentId: id})
    if (user) {
        res.status(200).send(user)
    } else {
        const newUser = new User({studentId: id})
        await newUser.save()
        res.status(200).send(newUser)
    }
}