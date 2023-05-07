import { useContext, useEffect, useMemo, useState } from "react";
import { PreferencesContext } from "./PreferencesContext";

export default function Schedule({items: scheduleItems, isDifferentDay}) {
    const [time,setTime] = useState(getCurrentTime());

    useEffect(() => {
        const q = setInterval(() => {
            setTime(getCurrentTime());
        }, 60000)
        return () => clearInterval(q);
    }, [])

    return (<div>
        {scheduleItems.length != 0 ? scheduleItems.map((e, i) => 
            <ScheduleItem 
                isDifferentDay={isDifferentDay} 
                time={time}
                key={i} 
                {...e} 
                number={i} 
                length={scheduleItems.length - 1} 
            />) : 
            <div>
                <p className={"text-center text-lg"}>No Schedule Data for this day</p>
            </div>
        }
    </div>)
}

function getCurrentTime() {
    //returns time in the format "HH:MM AM/PM"
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const amPm = hours >= 12 ? "PM" : "AM";
    const hour = hours % 12;
    const minute = minutes < 10 ? "0" + minutes : minutes;
    return hour + ":" + minute + " " + amPm;
}

function ScheduleItem(props) {
    const ctx = useContext(PreferencesContext);

    const betweenTime = useMemo(() => {
        if (!ctx.preferences.showProgressAcrossDays) return ["#E22626", "#E22626", "#E22626"];
        if (props.isDifferentDay) return ["#6b7280", "#6b7280", "#6b7280"]; 
        switch (isBetweenTime(props.time, props.startTime, props.endTime)) {
            case -1:
            default:
                return ["#6b7280", "#6b7280", "#6b7280"]; 
            case 0:
                return ["#E22626", "#E22626", "#6b7280"];
            case 1:
                return ["#E22626", "#E22626", "#E22626"];
        }
    }, [props.time, props.startTime, props.endTime, props.isDifferentDay, ctx.preferences.showProgressAcrossDays]);

    return (<div className={"flex items-center"}>
        <svg height="80" width="25" className="wadaily-line">
            {props.number != 0 ? <line x1="12.5" y1="0" x2="12.5" y2="40" style={{stroke: betweenTime[0], strokeWidth: 3}}></line> : null}
            {props.number != props.length ? <line x1="12.5" y1="40" x2="12.5" y2="80" style={{stroke: betweenTime[2], strokeWidth: 3}}></line> : null}
            <circle cx="12.5" cy="40" r="6" fill={betweenTime[1]}></circle>
        </svg>
        <div className="animate-slide-in">
            <p className={"text-3xl font-medium"} suppressHydrationWarning>{ctx.preferences.classNames?.[props.code] ?? props.name}</p>
            <p>{props.startTime} to {props.endTime}</p>
        </div>
    </div>);
}

function isBetweenTime(time, start, end) {
    return convertToDecimalTime(time) >= convertToDecimalTime(start) && convertToDecimalTime(time) <= convertToDecimalTime(end) ? 0 : convertToDecimalTime(time) > convertToDecimalTime(end) ? 1 : -1;
}

function convertToDecimalTime(time) {
    // time is in format "HH:MM AM/PM"
    // returns time in decimal form
    let [hour, minute, amPm] = time.split(/[ :]/g);
    if (hour == 12 && amPm == "AM") return parseInt(minute) / 60;
    if (amPm == "PM" && hour != 12) hour = parseInt(hour) + 12;
    return parseInt(hour) + parseInt(minute) / 60;
}
