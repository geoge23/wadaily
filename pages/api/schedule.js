import getScheduleDay from "../../functions/day";
import getScheduleList from "../../functions/schedule";

export default async function handler(req,res) {
    const day = req.query.date ? await getScheduleDay(req.query.date) : await getScheduleDay()
    res.status(200).send(await getScheduleList(day))
}