import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function ControlBar({date, propsDate, forward, back, reset}) {
    const [month, day, year] = date.split("-").map(e => parseInt(e))
    const viewingDate = new Date(year + 2000, month - 1, day)

    return (<div className={"flex md:flex-row flex-col my-4 mx-4 items-center justify-between"}>
        <div className={"flex items-center"}>
            <IoIosArrowBack className={"mr-2 cursor-pointer"} onClick={back}/>
            <p>{days[viewingDate.getDay()]} - {date}</p>
            <IoIosArrowForward className={"ml-2 cursor-pointer"} onClick={forward} />
        </div>
        {date == propsDate ? null : <p className="text-center">You are viewing info for {date} • <a className="cursor-pointer underline" onClick={reset}>See Today</a></p>}
    </div>)
}
