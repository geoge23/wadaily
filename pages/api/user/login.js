import { Users } from '../../../functions/mongo'

export default async function login(req, res) {
    const { id } = req.body
    if (!id) return res.status(400).send({error: 'Missing student ID'})
    const user = await Users.findOne({studentId: id})
    if (user) {
        if (!user.name || !user.email) {
            return res.status(200).send({...user.toObject(), missingDetails: true})
        } else {
            return res.status(200).send(user.toObject())
        }
    } else {
        const newUser = new Users({studentId: id})
        await newUser.save()
        res.status(200).send({...newUser.toObject(), missingDetails: true})
    }
}