
import Cache from 'node-cache'
import ical from 'node-ical'
import { Announcements } from './mongo'
const calCache = new Cache()

export default async function getCalendarList(date) {
    //https://www.woodward.edu/cf_calendar/feed.cfm?type=ical&feedID=69E9E2249C8A417481450E0F1F73A345
    const Now = date ? new Date(date) : new Date()
    const formattedDate = `${Now.getFullYear()}-${Now.getMonth() + 1}-${Now.getDate().toString().padStart(2, "0")}`
    let items = calCache.get(formattedDate);
    if (items == undefined) {
        let a = calCache.get('calendar-text');
        if (a == undefined) {
            const ics = await fetch("https://www.woodward.edu/cf_calendar/feed.cfm?type=ical&feedID=69E9E2249C8A417481450E0F1F73A345")
            a = await ics.text()
            calCache.set('calendar-text', a, 6000);
        }
        const icl = await ical.async.parseICS(a);
        items = [];

        //get items from calendar
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
        if (items.length > 0) {
            items.unshift({
                type: 'title',
                text: 'Calendar Events'
            })
        }

        //query for announcements
        const waDate = `${Now.getMonth() + 1}-${Now.getDate()}-${Now.getFullYear() % 100}`
        const dayAnnouncement = await Announcements.findOne({
            type: 'day',
            date: waDate
        })
        if (dayAnnouncement != undefined && dayAnnouncement.list.length > 0) {
            items.push({
                type: 'title',
                text: 'Today'
            })
            dayAnnouncement.list.forEach(e => {
                items.push({
                    type: 'entry',
                    text: e
                })
            })
        }

        const weekAnnouncement = await Announcements.findOne({
            type: 'week',
            week: getWeek(Now) * Now.getFullYear()
        })
        if (weekAnnouncement != undefined && weekAnnouncement.list.length > 0) {
            items.push({
                type: 'title',
                text: 'This Week'
            })
            weekAnnouncement.list.forEach(e => {
                items.push({
                    type: 'entry',
                    text: e
                })
            })
        }
        
        calCache.set(formattedDate, items, 6000);
    }

    return items.length == 0 ? [{
        type: 'title',
        text: 'No Announcements Today'
    }] : items;
}

function getWeek(d) {
    var date = new Date(d.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                            - 3 + (week1.getDay() + 6) % 7) / 7);
}