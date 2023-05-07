/* eslint-disable @next/next/no-img-element */
export default function Footer() {
    return (<div name="home" className={"rounded-2xl shadow-lg md:h-24 flex md:flex-row flex-col md:items-center md:justify-center bg-gray-400 w-full mb-4 md:box-content box-border md:p-0 p-5 dark:bg-gray-600"}>
        <div className="image-switcher self-center md:mb-0 mb-2 md:mr-2">
            <img src="wa.png" alt="Woodward Logo" className={"filter invert h-14 w-14 self-center mb-0"} />
            <img src="gcs.png" alt="George Computer Services Logo" className={"filter opacity-0 invert h-0 mb-0"} />
        </div>
        <div className="text-white md:text-lg font-medium">
            <p className="md:mb-0 mb-2">
                This site is maintained by Woodward Academy
            </p>
            <span className={"flex w-full"}>
                    <p className="md:text-left text-center">Copyright © George Parks {(new Date()).getFullYear()} ▪ See more at <a href="https://georgeparks.me" className="underline ml-1">georgeparks.me</a></p>
            </span>
        </div>
    </div>)
}