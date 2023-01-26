import { v4 } from 'uuid';
import { Challenges, Users } from '../../../functions/mongo';

export default async function challenge(req, res) {
    const id = req.body.id;
    if (!id) return res.status(400).send({error: 'Missing student ID'});
    const user = Users.findOne({studentId: id});
    const challenge = v4();
    const newChallenge = new Challenges({studentId: id, challenge, date: new Date()});
    await newChallenge.save();
    return res.status(200).send({challenge, requiredAction: user ? 'login' : 'register'});
}
