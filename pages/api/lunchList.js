import getMenuList from "../../functions/menuList";

export default async function handler(req,res) {
    const lunchList = req.query.date ? await getMenuList(req.query.date) : await getMenuList();
    res.status(200).send(lunchList)
}