import ical from 'node-ical'

export default async function getCalendarList(date) {
    //https://www.woodward.edu/cf_calendar/feed.cfm?type=ical&feedID=69E9E2249C8A417481450E0F1F73A345
    const Now = date ? new Date(date) : new Date()
    const formattedDate = `${Now.getFullYear()}-${Now.getMonth() + 1}-${Now.getDate().toString().padStart(2, "0")}`
    const ics = await fetch("https://www.woodward.edu/cf_calendar/feed.cfm?type=ical&feedID=69E9E2249C8A417481450E0F1F73A345")
    const a = await ics.text()
    const icl = await ical.async.parseICS(a);
    const items = [];
    for (let e in icl) {
        const startDate = icl[e].start;
        const startDateString = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate().toString().padStart(2, "0")}`
        if (formattedDate == startDateString) {
            items.push({
                type: 'entry',
                text: icl[e].summary
            })
        }
    }

    return items.length == 0 ? [{
        type: 'title',
        text: 'No Events Scheduled'
    }] : items;
}