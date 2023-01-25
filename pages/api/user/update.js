import { User } from '../../../functions/mongo'

export default async function update(req, res) {
    const { name, email, id } = req.body
    const user = await User.findOne({studentId: id})
    if (name) user.name = name;
    if (email) user.email = email;
    await user.save()
    res.status(200).send(user)
}