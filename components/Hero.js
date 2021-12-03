export default function Hero() {
    return (<div name="home" className={"md:justify-between justify-end box-border px-6 py-5 md:items-end rounded-2xl shadow-lg h-60 flex bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 w-full md:flex-row flex-col"}>
        <div>
            <p className={"text-white text-2xl font-light tracking-wider"}>Today is a</p>
            <p className={"text-white text-5xl font-bold"}>Day 1</p>
        </div>
        <div className={"md:mt-0 mt-2"}>
            <p className={"text-white"}>Open βeta • <a className="underline" href="https://georgeparks.me">Report an Issue »</a></p>
        </div>
    </div>)
}