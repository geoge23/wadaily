import getCalendarList from "../../functions/calendar";

export default async function handler(req,res) {
    const calendarList = req.query.date ? await getCalendarList(req.query.date) : await getCalendarList();
    res.status(200).send(calendarList)
}