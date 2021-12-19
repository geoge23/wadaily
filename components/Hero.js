import HeadsUp from "./HeadsUp";

export default function Hero({day}) {
    return (<div name="home" className={`
        md:justify-between justify-end box-border px-6 py-5 
        md:items-end rounded-2xl shadow-lg h-60 flex 
        bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 
        dark-bg-none dark:bg-gray-500
        w-full md:flex-row flex-col
        relative
    `}>
        <div>
            <p className={"text-white text-2xl font-light tracking-wider"}>Today is a</p>
            <p className={"text-white text-4xl md:text-5xl font-bold"}>{day}</p>
        </div>
        <div className={"md:mt-0 mt-2"}>
            <p className={"text-white"}>Open βeta • <a className="underline" href="https://forms.gle/pWSrxjLcbAtqtoax7">Report an Issue »</a></p>
        </div>
        <div className="absolute top-0 w-full left-0">
            <HeadsUp />
        </div>
    </div>)
}