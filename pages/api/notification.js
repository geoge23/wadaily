import Cache from 'node-cache';
import dbConnect, { Notifications } from '../../functions/mongo';
const notificationCache = new Cache();

export default async function handler(req, res) {
    let notifications = notificationCache.get('notification')
    if (notifications == undefined) {
        await dbConnect()
        notifications = await Notifications.find({"goodUntil": {$gte: new Date()}}).sort({goodUntil: 1});
        notificationCache.set('notification', notifications, 120)
    }
    res.setHeader("Cache-Control", "no-store")
    res.status(200).send(notifications)
}