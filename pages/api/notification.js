import Cache from 'node-cache'
const notificationCache = new Cache();

export default async function handler(req, res) {
    let ex = notificationCache.get('notification')
    let code = notificationCache.get('code')
    if (ex == undefined || code == undefined) {
        const data = await fetch('https://nodered.geoge.co/wadaily/notification')
        code = data.status;
        notificationCache.set('code', code, 200)
        ex = await data.json()
        notificationCache.set('notification', ex, 200)
    }
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')

    res.status(code).send(ex)
}