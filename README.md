<img src="https://wadaily.co/logo.png" height="75">
<h1>The WADaily Project</h1>

WADaily is a student-led schedule viewing website created in 2021 by George Parks for use at Woodward Academy. This website primarily allows students to check the current schedule, along with a few other features. For instance, it displays updated weather information, a school calendar, and the lunch menu for the day. You can visit a hosted verison of the site at [wadaily.co](wadaily.co)

![Screenshot](https://i.ibb.co/Hdr30z9/wadaily-co.png)

### WADaily API
Please be kind to the server bandwidth and abide by cache headers! A rate limit is implemented for requests over a reasonable amount, and you will receive a HTTP code 429 if you hit endpoints repeatedly
- https://wadaily.co/api/schedule
  - Returns JSON object holding the schedule day 
```json
{
  "name": "DAY3",
  "friendlyName": "Day 3",
  "schedule": [
    {
      "name": "Fourth Period",
      "code": "D",
      "startTime": "8:40 AM",
      "endTime": "9:35 AM"
    },
    ...
   ]
}
```
- https://wadaily.co/api/lunchList, https://wadaily.co/api/calendar, https://wadaily.co/api/westCommonsList
  - Returns JSON arrays holding objects representing list items
```json
[
  {
    "type": "title",
    "text": "ENTREES"
  },
  {
    "type": "entry",
    "text": "Pastrami and Cheese Hoagie"
  },
  ...
]
```
        
### Related Repositories 
- https://github.com/geoge23/wadaily-admin-panel - Admin panel for faculty to edit schedule data
- https://github.com/willv678/WADaily-Mobile - Mobile app built in React Native using the WADaily API
