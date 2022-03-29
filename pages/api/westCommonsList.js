import getWestCommonsList from "../../functions/westCommonsList";

export default async function handler(req,res) {
    const lunchList = req.query.date ? await getWestCommonsList(req.query.date) : await getWestCommonsList();
    res.status(200).send(lunchList)
}