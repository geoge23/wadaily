export default function Schedule({items: scheduleItems}) {
    

    return (<div>
        {scheduleItems.length != 0 ? scheduleItems.map((e, i) => <ScheduleItem key={i} {...e} number={i} length={scheduleItems.length - 1} />) : <div>
            <p className={"text-center text-gray-600 text-lg"}>No Schedule Data for this day</p>
            </div>}
    </div>)
}

function ScheduleItem(props) {
    return (<div className={"flex items-center"}>
        <svg height="80" width="25">
            {props.number != 0 ? <line x1="12.5" y1="0" x2="12.5" y2="40" style={{stroke: '#E22626', strokeWidth: 3}}></line> : null}
            <circle cx="12.5" cy="40" r="6" fill="#E22626"></circle>
            {props.number != props.length ? <line x1="12.5" y1="40" x2="12.5" y2="80" style={{stroke: '#E22626', strokeWidth: 3}}></line> : null}
        </svg>
        <div>
            <p className={"text-3xl font-medium text-gray-700"}>{props.name}</p>
            <p>{props.startTime} to {props.endTime}</p>
        </div>
    </div>);
}
