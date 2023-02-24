import { useEffect, memo, useRef, useContext } from "react"
import Countdown from "./Countdown";
import { PreferencesContext } from "./PreferencesContext"
import WeatherIcon from "./WeatherIcon"
import WidescreenDateText from "./WidescreenDateText";

export default function Hero({day, isDifferentDay = false, widescreen = false, temp, icon}) {
    const ref = useRef(null)
    const ctx = useContext(PreferencesContext)

    return (<div name="home" className={`
        md:justify-between justify-end box-border
        md:items-end shadow-lg flex bg-gradient-to-r 
        dark-bg-none dark:bg-gray-500
        w-full md:flex-row flex-col relative overflow-hidden
        ${widescreen ? "w-screen z-50 left-0 top-0 h-52 py-7 px-20 sticky": "rounded-2xl h-60 py-5 px-6"}
        ${false ? "from-blue-200 to-blue-500" : "from-yellow-400 via-red-500 to-pink-500" }
    `} ref={ref}>
        <div className="z-10">
            <p className={"text-white text-2xl font-light tracking-wider"}>{isDifferentDay ? "This day is a" : "Today is a"}</p>
            <p className={"text-white text-4xl md:text-6xl font-bold"}>{day}</p>
            {widescreen && <div className={"flex flex-row mt-3"}>
                <div className={"py-1 px-2"}>
                    <WeatherIcon icon={icon}></WeatherIcon>
                </div>
                <p className={"text-white text-lg font-light tracking-wider py"}>{temp}°F • College Park</p>
            </div>}
        </div>
        {widescreen ? <div className={"md:mt-0 mt-2"}>
            <WidescreenDateText></WidescreenDateText>
        </div> : <div className={"md:mt-0 mt-2 text-right"}>
            <Countdown 
                endDate={new Date("2023-04-25T15:15:00+0000")} 
                title="Seniors' Last Day"
                completeMessage="✨ Congrats to the class of &apos;23!"
            />
        </div>}
        {/* {ctx.preferences.theming && <Leaves divRef={ref} />} */}
    </div>)
}


const Leaves = memo(function Leaves({divRef}) {
    function Leaf() {
        /** @type {import("react").RefObject<HTMLParagraphElement>} */
        const ref = useRef(null)
        
        useEffect(() => {
            ref.current.style.left = Math.random() * 100 + "%"
            const bound = divRef.current.getBoundingClientRect().bottom - divRef.current.getBoundingClientRect().top
            let y = Math.random() * -bound;
            let x = 1;
            let q = Math.random() * 5 + 10
            ref.current.innerText = ["🎄", "✨", "❄️", "☃️", "⭐️"][Math.floor(Math.random() * 5)]
            let interval = setInterval(() => {
                y += 1
                x = Math.sin(y / q) * q
                ref.current.style.transform = `translate(${x}px, ${y}px)`
                if (y > bound) {
                    y = -40 * Math.random() - 10
                    q = Math.random() * 15
                    ref.current.style.left = Math.random() * 100 + "%"
                }
            }, 50)
            return () => clearInterval(interval)
        }, [])

        return <p ref={ref} className="w-1 absolute top-1 z-0 text-xl">🍁</p>
    }

    return (<div className="absolute top-0 left-0 w-full">
        {Array.from({length: 20}).map((e, i) => <Leaf key={i} />)}
    </div>)
})