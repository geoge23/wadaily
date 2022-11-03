/* eslint-disable @next/next/no-img-element */
export default function Footer() {
    return (<div name="home" className={"rounded-2xl shadow-lg md:h-24 flex md:flex-row flex-col md:items-center md:justify-center bg-gray-400 w-full mb-4 md:box-content box-border md:p-0 p-5 dark:bg-gray-600"}>
        <img src="gcs.png" alt="George Computer Services Logo" className={"filter invert md:h-14 h-16 w-16 md:w-14 mr-3 self-center mb-3 md:mb-0"} />
        <div className="text-white md:text-lg font-medium">
            <p className="md:mb-0 mb-2">
                This site is definitely affiliated with Woodward Academy • <a className="underline" rel="noreferrer" href={"./credits.html"} target="_blank">View Contributors »</a>
            </p>
            <span className={"flex w-full md:flex-row flex-col"}>
                    <p className={"flex"}>Copyright © George Parks 2022</p>
                    <p className={"md:ml-auto"}>Contact at <a href="mailto:me@georgeparks.me">me@georgeparks.me</a></p>
            </span>
        </div>
    </div>)
}