import conn, { Days } from './mongo';

export default async function getScheduleDay(date) {
    if (!date) {
        const Now = new Date();
        date = `${Now.getMonth() + 1}-${Now.getDate()}-${Now.getFullYear() % 100}`
    }
    await conn();
    const day = await Days.findOne({date})
    return day?.schedule || 'NONE';
}